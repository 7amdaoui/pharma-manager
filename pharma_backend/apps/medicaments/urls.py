from rest_framework.routers import DefaultRouter
from .views import MedicamentViewSet

router = DefaultRouter()
router.register(r'', MedicamentViewSet, basename='medicament')

urlpatterns = router.urls