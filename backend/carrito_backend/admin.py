from django.contrib import admin
from .models import Producto, Carrito, DetalleCarrito, Supermercado

#  Register your models here.
admin.site.register(Producto)
admin.site.register(Carrito)
admin.site.register(DetalleCarrito)
admin.site.register(Supermercado)