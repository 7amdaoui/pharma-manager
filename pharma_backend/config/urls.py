from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/v1/categories/', include('apps.categories.urls')),
    path('api/v1/medicaments/', include('apps.medicaments.urls')),
    path('api/v1/ventes/', include('apps.ventes.urls')),
]