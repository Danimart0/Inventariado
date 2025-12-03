from django.db import models


class Producto(models.Model):
    nombre = models.CharField(max_length=255, unique=True)
    id_producto = models.CharField(max_length=100, unique=True, blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    foto = models.ImageField(upload_to='fotos_productos/', blank=True, null=True)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=0)
    stock_minimo = models.PositiveIntegerField(default=5)
    stock_maximo = models.PositiveIntegerField(default=100)
    ultimo_registro = models.DateTimeField(auto_now=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
    @property
    def imageUrl(self):
        if self.foto:
            try:
                return self.foto.url
            except ValueError:
                return None
        return None

# --- Modelo de Clientes ---

class Cliente(models.Model):
    nombre = models.CharField(max_length=255)
    direccion = models.TextField(blank=True, null=True)
    saldo_actual = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    ultimo_pago = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.nombre

# --- Modelo de Personal/Trabajadores ---

class Trabajador(models.Model):
    nombre = models.CharField(max_length=255)
    correo = models.EmailField(max_length=255, unique=True)
    numero = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.nombre
    


    # --- Modelo 4: Para registrar entradas y salidas (para MovimientosStock.jsx) ---

class MovimientoStock(models.Model):
    # Opciones para el campo 'tipo'
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
    ]

    
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='movimientos')
    
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    
    cantidad = models.PositiveIntegerField()
    nota = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        # Texto amigable para el admin de Django
        return f"{self.get_tipo_display()} de {self.cantidad} para {self.producto.nombre}"
    


class Cajero(models.Model):
    # Información Personal
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    
    # Identificación única
    codigo_empleado = models.CharField(max_length=20, unique=True, help_text="ID único del empleado/cajero")
    
    # Datos de contacto
    telefono = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    
    # Control de estado
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True, help_text="Desmarcar si ya no labora")

    def __str__(self):
        return f"{self.nombre} {self.apellidos}"

    class Meta:
        verbose_name = "Cajero"
        verbose_name_plural = "Cajeros"
        ordering = ['nombre']