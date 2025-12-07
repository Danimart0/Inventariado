from django.test import TestCase
from .models import Producto, MovimientoStock
from .serializers import MovimientoStockSerializer

class MovimientoStockTests(TestCase):

    def setUp(self):
        
        #docker-compose exec backend python manage.py test
        self.producto = Producto.objects.create(
            nombre="Coca Cola",
            id_producto="COCA-123",
            precio_venta=20.00,
            stock=10  # Empezamos con 10 unidades
        )

    def test_salida_stock_suficiente(self):
        """Debe permitir salida si hay stock suficiente"""
        data = {
            'producto': self.producto.id,
            'tipo': 'salida',
            'cantidad': 5,  # 5 es menor que 10
            'nota': 'Venta normal'
        }
        serializer = MovimientoStockSerializer(data=data)
        self.assertTrue(serializer.is_valid(), "El serializer debería ser válido con stock suficiente")

    def test_salida_stock_insuficiente(self):
        """Debe FALLAR si intentamos sacar más de lo que hay"""
        data = {
            'producto': self.producto.id,
            'tipo': 'salida',
            'cantidad': 20, # 20 es mayor que 10 (ERROR ESPERADO)
            'nota': 'Robo hormiga masivo'
        }
        serializer = MovimientoStockSerializer(data=data)
        
        # Verificamos que sea inválido
        self.assertFalse(serializer.is_valid()) 
        # Verificamos que el mensaje de error sea el correcto
        self.assertIn("Stock insuficiente", str(serializer.errors))

    def test_entrada_stock(self):
        """Las entradas siempre deben pasar"""
        data = {
            'producto': self.producto.id,
            'tipo': 'entrada',
            'cantidad': 100,
            'nota': 'Resurtido'
        }
        serializer = MovimientoStockSerializer(data=data)
        self.assertTrue(serializer.is_valid())