from django.shortcuts import render
from rest_framework.response import Response 
from rest_framework import generics 
from .serializers import *
from .models import *

# Create your views here.

class CarritoView(generics.CreateAPIView):
    serializer_class = CarritoSerializer
    

    def get(self, request, pk):
        if pk==0:
            carritos = Carrito.objects.all()
            data = [CarritoSerializer(carrito).data for carrito in carritos]
            return Response(data, status=200)

        carrito = Carrito.objects.get(id=pk)
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
    
    def get(self, request):
        pass

    def post(self, request):

        data = {
            'id_carrito': request.data['id_carrito'],
            'id_producto': request.data['id_carrito'],
            'cantidad': request.data['id_carrito']
        }

        serializer = DetalleCarritoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=500)
        return Response(serializer.data, status=200)


class ProductoView(generics.CreateAPIView):
    serializer_class = ProductoSerializer

    def get(self, request, pk):

        if pk==0:
            productos = Producto.objects.all()
            data = [ProductoSerializer(producto).data for producto in productos]
            print(data)
            return Response(data, status=200)
        
        producto = Producto.objects.get(id=pk)
        data = ProductoSerializer(producto).data
        print(data)
        return Response(data, status=200)


