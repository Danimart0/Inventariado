from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Producto, Cliente

class InventarioTests(APITestCase):

    def setUp(self):
        """
        Esta función se ejecuta ANTES de cada prueba.
        Preparamos datos falsos para probar.
        """
        # Creamos un producto con 10 unidades de stock
        self.producto = Producto.objects.create(
            nombre="Coca Cola 600ml",
            id_producto="COCA-600",
            precio_venta=15.00,
            stock=10, 
            stock_minimo=5
        )
        
        # URLs automáticas del Router de DRF
        self.url_movimientos = '/api/movimientos/'  # Asegúrate que esta sea tu ruta en urls.py
        self.url_productos = '/api/productos/'

    def test_crear_producto(self):
        """
        Prueba que se pueda crear un producto nuevo vía API.
        """
        data = {
            "nombre": "Pepsi",
            "precio_venta": 14.00,
            "stock": 20
        }
        response = self.client.post(self.url_productos, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Producto.objects.count(), 2) # 1 del setUp + 1 nuevo

    def test_salida_stock_suficiente(self):
        """
        Debe PERMITIR una salida si la cantidad solicitada es menor al stock.
        """
        data = {
            "producto": self.producto.id,
            "tipo": "salida",
            "cantidad": 5, # Tenemos 10, pedimos 5 -> OK
            "nota": "Venta normal"
        }
        response = self.client.post(self.url_movimientos, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_salida_stock_insuficiente(self):
        """
        Debe DENEGAR (Error 400) una salida si pedimos más de lo que hay.
        Esta prueba valida tu lógica del Serializer.
        """
        data = {
            "producto": self.producto.id,
            "tipo": "salida",
            "cantidad": 20, # Tenemos 10, pedimos 20 -> ERROR
            "nota": "Intento de sobreventa"
        }
        response = self.client.post(self.url_movimientos, data, format='json')
        
        # Esperamos un error 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Opcional: Verificar que el mensaje de error sea el correcto
        self.assertIn('Stock insuficiente', str(response.data))