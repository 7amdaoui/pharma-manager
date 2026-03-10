from rest_framework import serializers
from .models import Medicament


class MedicamentSerializer(serializers.ModelSerializer):
    """Serializer complet pour le modèle Medicament."""
    est_en_alerte = serializers.ReadOnlyField()
    categorie_nom = serializers.CharField(source='categorie.nom', read_only=True)

    class Meta:
        model = Medicament
        fields = [
            'id', 'nom', 'dci', 'categorie', 'categorie_nom',
            'forme', 'dosage', 'prix_achat', 'prix_vente',
            'stock_actuel', 'stock_minimum', 'date_expiration',
            'ordonnance_requise', 'date_creation', 'est_actif', 'est_en_alerte'
        ]

    def validate_prix_vente(self, value):
        """Valide que le prix de vente est positif."""
        if value <= 0:
            raise serializers.ValidationError("Le prix de vente doit être positif.")
        return value

    def validate_stock_minimum(self, value):
        """Valide que le stock minimum est positif."""
        if value < 0:
            raise serializers.ValidationError("Le stock minimum ne peut pas être négatif.")
        return value