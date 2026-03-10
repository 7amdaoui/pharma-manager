from rest_framework import serializers
from .models import Vente, LigneVente
from apps.medicaments.models import Medicament


class LigneVenteSerializer(serializers.ModelSerializer):
    """Serializer pour une ligne de vente."""
    medicament_nom = serializers.CharField(source='medicament.nom', read_only=True)

    class Meta:
        model = LigneVente
        fields = ['id', 'medicament', 'medicament_nom', 'quantite', 'prix_unitaire', 'sous_total']
        read_only_fields = ['sous_total']


class VenteSerializer(serializers.ModelSerializer):
    """Serializer pour une vente avec ses lignes."""
    lignes = LigneVenteSerializer(many=True)

    class Meta:
        model = Vente
        fields = ['id', 'reference', 'date_vente', 'total_ttc', 'statut', 'notes', 'lignes']
        read_only_fields = ['reference', 'total_ttc']

    def validate_lignes(self, lignes):
        """Valide que la vente contient au moins une ligne."""
        if not lignes:
            raise serializers.ValidationError("Une vente doit contenir au moins un médicament.")
        return lignes

    def create(self, validated_data):
        """Crée une vente et déduit les stocks automatiquement."""
        lignes_data = validated_data.pop('lignes')
        vente = Vente.objects.create(**validated_data)

        for ligne_data in lignes_data:
            medicament = ligne_data['medicament']
            quantite = ligne_data['quantite']

            if medicament.stock_actuel < quantite:
                raise serializers.ValidationError(
                    f"Stock insuffisant pour {medicament.nom}. Disponible: {medicament.stock_actuel}"
                )

            # Snapshot du prix au moment de la vente
            ligne_data['prix_unitaire'] = medicament.prix_vente
            LigneVente.objects.create(vente=vente, **ligne_data)

            # Déduction du stock
            medicament.stock_actuel -= quantite
            medicament.save()

        vente.calculer_total()
        return vente