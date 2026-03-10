from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Medicament
from .serializers import MedicamentSerializer


@extend_schema_view(
    list=extend_schema(summary='Liste des médicaments', tags=['Médicaments']),
    create=extend_schema(summary='Créer un médicament', tags=['Médicaments']),
    retrieve=extend_schema(summary='Détail médicament', tags=['Médicaments']),
    update=extend_schema(summary='Modifier médicament', tags=['Médicaments']),
    destroy=extend_schema(summary='Supprimer médicament (soft delete)', tags=['Médicaments']),
)
class MedicamentViewSet(viewsets.ModelViewSet):
    """ViewSet CRUD pour les médicaments avec soft delete et alertes stock."""

    serializer_class = MedicamentSerializer

    def get_queryset(self):
        """Retourne uniquement les médicaments actifs."""
        return Medicament.objects.filter(est_actif=True).select_related('categorie')

    def perform_destroy(self, instance):
        """Soft delete — désactive le médicament au lieu de le supprimer."""
        instance.est_actif = False
        instance.save()

    @extend_schema(summary='Médicaments en alerte stock', tags=['Médicaments'])
    @action(detail=False, methods=['get'], url_path='alertes')
    def alertes(self, request):
        """Retourne les médicaments dont le stock est inférieur au seuil minimum."""
        medicaments = self.get_queryset().filter(
            stock_actuel__lte=F('stock_minimum')
        )
        serializer = self.get_serializer(medicaments, many=True)
        return Response(serializer.data)