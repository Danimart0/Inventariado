# api/views.py

from rest_framework import viewsets

# Importación de modelos
from .models import (
    Producto, 
    Cliente, 
    Trabajador, 
    MovimientoStock, 
    Cajero
)

# Importación de serializers
from .serializers import (
    ProductoSerializer, 
    ClienteSerializer, 
    TrabajadorSerializer, 
    MovimientoStockSerializer,
    CajeroSerializer
)

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer

class MovimientoStockViewSet(viewsets.ModelViewSet):
    """
    Endpoint de API para Movimientos de Stock.
    Ordenado por fecha descendente (lo más reciente primero).
    """
    queryset = MovimientoStock.objects.all().order_by('-fecha') 
    serializer_class = MovimientoStockSerializer

class CajeroViewSet(viewsets.ModelViewSet):
    queryset = Cajero.objects.all()
    serializer_class = CajeroSerializer