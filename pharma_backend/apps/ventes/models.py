from django.db import models
from apps.medicaments.models import Medicament
import uuid


def generate_reference():
    """Génère une référence unique pour chaque vente."""
    from django.utils import timezone
    year = timezone.now().year
    unique = str(uuid.uuid4())[:8].upper()
    return f'VNT-{year}-{unique}'


class Vente(models.Model):
    """
    Représente une transaction de vente.

    Attributs:
        reference (str): Code unique auto-généré.
        date_vente (datetime): Date et heure de la transaction.
        total_ttc (Decimal): Montant total calculé automatiquement.
        statut (str): En cours / Complétée / Annulée.
    """
    STATUT_CHOICES = [
        ('en_cours', 'En cours'),
        ('completee', 'Complétée'),
        ('annulee', 'Annulée'),
    ]

    reference = models.CharField(max_length=50, unique=True, default=generate_reference)
    date_vente = models.DateTimeField(auto_now_add=True)
    total_ttc = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='completee')
    notes = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = 'Vente'
        verbose_name_plural = 'Ventes'
        ordering = ['-date_vente']

    def __str__(self):
        return f'{self.reference} — {self.total_ttc} MAD'

    def calculer_total(self):
        """Recalcule et sauvegarde le total de la vente."""
        total = sum(ligne.sous_total for ligne in self.lignes.all())
        self.total_ttc = total
        self.save()


class LigneVente(models.Model):
    """
    Représente une ligne d'une vente (un médicament vendu).

    Attributs:
        vente (Vente): La vente associée.
        medicament (Medicament): Le médicament vendu.
        quantite (int): Quantité vendue.
        prix_unitaire (Decimal): Snapshot du prix au moment de la vente.
        sous_total (Decimal): quantite x prix_unitaire.
    """
    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name='lignes')
    medicament = models.ForeignKey(Medicament, on_delete=models.PROTECT)
    quantite = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    sous_total = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    class Meta:
        verbose_name = 'Ligne de vente'

    def save(self, *args, **kwargs):
        """Calcule automatiquement le sous_total avant sauvegarde."""
        self.sous_total = self.quantite * self.prix_unitaire
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.medicament.nom} x{self.quantite}'