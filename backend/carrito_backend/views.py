from django.shortcuts import render
from rest_framework.response import Response 
from rest_framework import generics 
from .serializers import *
from .models import *

# Create your views here.

class CarritoView(generics.CreateAPIView):
    serializer_class = CarritoSerializer
    

    def get(self, request, pk=None):
        if pk==None:
            carritos = Carrito.objects.all()
            data = [CarritoSerializer(carrito).data for carrito in carritos]
            return Response(data, status=200)

        carrito = Carrito.objects.get(id=pk)
        print(carrito.precioTotal)
        data = CarritoSerializer(carrito).data
        return Response(data, status=200)

    def post(self, request):
        serializer = CarritoSerializer(data={})


        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=500)
        return Response(serializer.data, status=200)
    

class DetalleCarritoView(generics.CreateAPIView):
    serializer_class = DetalleCarritoSerializer
    
    def get(self, request, pk=None):
        if pk == None:
            carritos = DetalleCarrito.objects.all()
            data = [DetalleCarritoSerializer(carrito).data for carrito in carritos]
            return Response(data, status=200)

        carrito = DetalleCarrito.objects.get(id=pk)
        data = DetalleCarritoSerializer(carrito).data
        return Response(data, status=200)

    def post(self, request):

        producto = Producto.objects.get(codigo_ean=request.data['codigo_ean'])

        data = {
            'id_carrito': request.data['id_carrito'],
            'id_producto': producto.id,
            'cantidad': request.data['cantidad']
        }

        serializer = DetalleCarritoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=500)
        
        return Response(serializer.data, status=200)


class ProductoView(generics.CreateAPIView):
    serializer_class = ProductoSerializer

    def get(self, request, pk=None):

        if pk==None:
            productos = Producto.objects.all()
            data = [ProductoSerializer(producto).data for producto in productos]
            return Response(data, status=200)
        
        producto = Producto.objects.get(codigo_ean=pk)
        data = ProductoSerializer(producto).data
        return Response(data, status=200)


