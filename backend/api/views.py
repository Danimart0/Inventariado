import logging
from rest_framework import viewsets, status
from rest_framework.response import Response
# Importamos tus modelos y serializers
from .models import Producto, Cliente, Trabajador, MovimientoStock, Cajero
from .serializers import (
    ProductoSerializer, ClienteSerializer, TrabajadorSerializer, 
    MovimientoStockSerializer, CajeroSerializer
)

# Configurar el logger para que Grafana lo escuche
logger = logging.getLogger('api')

# --- MÓDULO 1: PRODUCTOS ---
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def list(self, request, *args, **kwargs):
        # Log para Grafana
        logger.info(f"Consulta de inventario", extra={'tags': {'modulo': 'productos', 'accion': 'listar'}})
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # Log para Grafana
        logger.info(f"Producto creado: {request.data.get('nombre')}", extra={'tags': {'modulo': 'productos', 'accion': 'crear'}})
        return response

# --- MÓDULO 2: CLIENTES ---
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    def list(self, request, *args, **kwargs):
        logger.info("Listado de clientes consultado", extra={'tags': {'modulo': 'clientes'}})
        return super().list(request, *args, **kwargs)

# --- MÓDULO 3: MOVIMIENTOS ---
class MovimientoStockViewSet(viewsets.ModelViewSet):
    queryset = MovimientoStock.objects.all().order_by('-fecha')
    serializer_class = MovimientoStockSerializer
    
    def create(self, request, *args, **kwargs):
        logger.info("Movimiento de stock registrado", extra={'tags': {'modulo': 'movimientos'}})
        return super().create(request, *args, **kwargs)

# --- OTROS (Sin cambios) ---
class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer

class CajeroViewSet(viewsets.ModelViewSet):
    queryset = Cajero.objects.all()
    serializer_class = CajeroSerializer