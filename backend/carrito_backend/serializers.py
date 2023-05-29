from rest_framework import serializers
from .models import *


class CarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrito
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class DetalleCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleCarrito
        fields = '__all__'

class SupermercadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supermercado
        fields = '__all__'
