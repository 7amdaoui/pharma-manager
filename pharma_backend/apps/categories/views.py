from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Categorie
from .serializers import CategorieSerializer


@extend_schema_view(
    list=extend_schema(summary='Liste des catégories', tags=['Catégories']),
    create=extend_schema(summary='Créer une catégorie', tags=['Catégories']),
    retrieve=extend_schema(summary='Détail catégorie', tags=['Catégories']),
    update=extend_schema(summary='Modifier catégorie', tags=['Catégories']),
    destroy=extend_schema(summary='Supprimer catégorie', tags=['Catégories']),
)
class CategorieViewSet(viewsets.ModelViewSet):
    """ViewSet CRUD pour les catégories de médicaments."""

    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer