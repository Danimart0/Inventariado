# api/serializers.py


from rest_framework import serializers
from .models import Producto, Cliente, Trabajador, MovimientoStock
from .models import Cajero
class ProductoSerializer(serializers.ModelSerializer):

    imageUrl = serializers.ReadOnlyField()

    class Meta:
        model = Producto
        fields = '__all__' 
  

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = '__all__'


class MovimientoStockSerializer(serializers.ModelSerializer):
    """
    Serializer para Movimientos de Stock (Entradas/Salidas).
    """
    class Meta:
        model = MovimientoStock
        # Definimos los campos que usará el formulario de React
        fields = ['id', 'producto', 'tipo', 'cantidad', 'nota', 'fecha']
        # 'fecha' se crea automáticamente en el backend
        read_only_fields = ['fecha']

    def validate(self, data):
        """
        Validación para asegurar que no se saque más stock del que hay.
        """
        producto = data['producto']
        cantidad = data['cantidad']
        tipo = data['tipo']

        # Si es una 'salida', comprueba el stock
        if tipo == 'salida':
            if producto.stock < cantidad:
                # Este error le llegará a React si la validación falla
                raise serializers.ValidationError(
                    f"Stock insuficiente. Solo tienes {producto.stock} unidades de {producto.nombre}."
                )
        
        return data
    



class CajeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cajero
        fields = '__all__' # Expone todos los campos definidos en models.py
    

    # Agrega esto dentro de class MovimientoStockSerializer...

    def create(self, validated_data):
        # 1. Crear el movimiento
        movimiento = MovimientoStock.objects.create(**validated_data)
        
        # 2. Actualizar el stock del producto
        producto = movimiento.producto
        if movimiento.tipo == 'entrada':
            producto.stock += movimiento.cantidad
        elif movimiento.tipo == 'salida':
            producto.stock -= movimiento.cantidad
        
        # 3. Guardar el producto actualizado
        producto.save()
        
        return movimiento