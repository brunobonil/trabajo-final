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
    
    def patch(self, request, pk):
        carrito = Carrito.objects.get(id=pk)
        nuevoEstado = request.data["estado"]
        carrito.estado = nuevoEstado
        carrito.save()
        return Response(status=200)
    

class DetalleCarritoView(generics.CreateAPIView):
    serializer_class = DetalleCarritoSerializer
    
    def get(self, request, pk=None):
        #if pk == None:
            productosCarrito = DetalleCarrito.objects.filter(id_carrito=pk)
            data = [DetalleCarritoSerializer(prod).data for prod in productosCarrito]
            return Response(data, status=200)

        # carrito = DetalleCarrito.objects.get(id=pk)
        # data = DetalleCarritoSerializer(carrito).data
        # return Response(data, status=200)

    def post(self, request):

        # Obtener carrito
        carrito = Carrito.objects.get(id=request.data['id_carrito'])
        
        
        # Obtener producto
        producto = Producto.objects.get(codigo_ean=request.data['codigo_ean'])

        # Obtener detalle del carrito
        detalle_exist = DetalleCarrito.objects.filter(id_carrito=carrito.id, id_producto=producto.id)
        
        #Verifica si existe el producto en el carro, en caso de existir actualiza la cantidad   
        if detalle_exist:
            detalle = detalle_exist.get()
            detalle.cantidad += 1
            detalle.save()
            return Response(status=200)

        data = {
            'id_carrito': request.data['id_carrito'],
            'id_producto': producto.id,
            'nombre': producto.nombre,
            'descripcion': producto.descripcion,
            'precio': producto.precio,
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
    
# class ListadoCarritoView(generics.CreateAPIView):

#     def get(self, request, pk):
#         productosCarrito = DetalleCarrito.objects.filter(id_producto=pk)
#         data = [DetalleCarritoSerializer(prod).data for prod in productosCarrito]
#         return Response(data, status=200)

