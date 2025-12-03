# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views



# Crea un router y registra nuestros viewsets
router = DefaultRouter()
router.register(r'productos', views.ProductoViewSet, basename='producto')
router.register(r'clientes', views.ClienteViewSet, basename='cliente')
router.register(r'trabajadores', views.TrabajadorViewSet, basename='trabajador')
router.register(r'movimientos', views.MovimientoStockViewSet)
router.register(r'cajeros', views.CajeroViewSet, basename='cajero')
# Las URLs de la API son determinadas automáticamente por el router.
urlpatterns = [
    path('', include(router.urls)),
]