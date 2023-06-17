from django.db import models

# Create your models here.

class Supermercado(models.Model):
    nombre=models.CharField(max_length=20)

    def __str__(self):
        return (self.nombre)

class Producto(models.Model):
    nombre=models.CharField(max_length=60)
    precio=models.FloatField()
    codigo_ean=models.IntegerField()
    supermercado=models.ForeignKey(Supermercado, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return (self.nombre)

class Carrito(models.Model):
    listaEstados = [
        ('NUEVO', 'NUEVO'),
        ('COMPRANDO', 'COMPRANDO'),
        ('FINALIZADO', 'FINALIZADO')
    ]
    fecha=models.DateField(auto_now=False, auto_now_add=True)
    estado=models.CharField(max_length=10, default='NUEVO', choices=listaEstados)
    supermercado=models.ForeignKey(Supermercado, on_delete=models.CASCADE, null=True)
    
    @property
    def precioTotal(self):
        lista_detalles = DetalleCarrito.objects.filter(id_carrito=self.id)
        total = 0
        for detalle in lista_detalles:
            total += detalle.subtotal
        return total

        

class DetalleCarrito(models.Model):
    id_carrito=models.ForeignKey(Carrito, on_delete=models.CASCADE)
    id_producto=models.ForeignKey(Producto, on_delete=models.CASCADE, null=True)
    nombre = models.CharField(max_length=60, null=True)
    descripcion=models.CharField(max_length=300, null=True)
    precio=models.FloatField(null=True)
    cantidad=models.IntegerField(null=True)        

    @property
    def subtotal(self):
        return self.cantidad * self.id_producto.precio
