from django.db import models

# Create your models here.

class Producto(models.Model):
    nombre=models.CharField(max_length=60)
    descripcion=models.CharField(max_length=300)
    precio=models.FloatField()
    codigo_ean=models.IntegerField()

    def __str__(self):
        return (self.nombre)

class Carrito(models.Model):
    fecha=models.DateField(auto_now=False, auto_now_add=True)

    @property
    def precioTotal(self):
        pass

class DetalleCarrito(models.Model):
    id_carrito=models.ForeignKey(Carrito, on_delete=models.CASCADE)
    id_producto=models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad=models.IntegerField()        

    @property
    def subtotal(self):
        return self.cantidad * self.productos_set.all()

    
