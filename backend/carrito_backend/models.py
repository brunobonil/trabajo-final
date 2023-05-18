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
    listaEstados = [
        ('N', 'NUEVO'),
        ('C', 'COMPRANDO'),
        ('F', 'FINALIZADO')
    ]
    fecha=models.DateField(auto_now=False, auto_now_add=True)
    estado=models.CharField(max_length=1, default='N', choices=listaEstados)
    
    #TODO: Obtener el subtotal de los DetalleCarrito y sumarlos 
    @property
    def precioTotal(self):
        lista_detalles = DetalleCarrito.objects.filter(id_carrito=self.id)

        

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

    
