from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Vente
from .serializers import VenteSerializer


@extend_schema_view(
    list=extend_schema(summary='Historique des ventes', tags=['Ventes']),
    create=extend_schema(summary='Enregistrer une vente', tags=['Ventes']),
    retrieve=extend_schema(summary='Détail vente', tags=['Ventes']),
)
class VenteViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des ventes."""

    queryset = Vente.objects.prefetch_related('lignes__medicament').all()
    serializer_class = VenteSerializer
    http_method_names = ['get', 'post']

    @extend_schema(summary='Annuler une vente', tags=['Ventes'])
    @action(detail=True, methods=['post'], url_path='annuler')
    def annuler(self, request, pk=None):
        """Annule une vente et réintègre les stocks."""
        vente = self.get_object()

        if vente.statut == 'annulee':
            return Response(
                {'detail': 'Cette vente est déjà annulée.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Réintégration des stocks
        for ligne in vente.lignes.all():
            medicament = ligne.medicament
            medicament.stock_actuel += ligne.quantite
            medicament.save()

        vente.statut = 'annulee'
        vente.save()

        return Response({'detail': 'Vente annulée avec succès.'}, status=status.HTTP_200_OK)