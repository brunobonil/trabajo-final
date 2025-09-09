from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.response import Response 
from rest_framework import generics 
from .serializers import *
from .models import *

# Create your views here.

class CarritoView(generics.CreateAPIView):
    serializer_class = CarritoSerializer
    permission_classes = [AllowAny]    

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
        print(request.data)
        
        data = { 
            'supermercado': request.data['supermercado'] 
            }

        serializer = CarritoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=500)
        return Response(serializer.data, status=200)
    
    def patch(self, request, pk):
        carrito = Carrito.objects.get(id=pk)
        print(carrito.estado)

        nuevoEstado = request.data['estado']
        carrito.estado = nuevoEstado
        carrito.save()
        return Response(status=200)
    
class DetalleCarritoView(generics.CreateAPIView):
    serializer_class = DetalleCarritoSerializer
    permission_classes = [AllowAny]
    def get(self, request, pk=None):

        productosCarrito = DetalleCarrito.objects.filter(id_carrito=pk)
        data = []
        for prod in productosCarrito:
            producto_data = DetalleCarritoSerializer(prod).data
            producto_data['codigo_ean'] = prod.id_producto.codigo_ean
            data.append(producto_data)

        return Response(data, status=200)

    def post(self, request):
        try:
            # Obtener carrito
            carrito = Carrito.objects.get(id=request.data['id_carrito'])
        except Carrito.DoesNotExist:
            return Response({"error": "Carrito no encontrado"}, status=404)
        
        try:
            # Obtener producto
            producto = Producto.objects.get(codigo_ean=request.data['codigo_ean'], supermercado=carrito.supermercado)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado en el supermercado del carrito"}, status=404)

        # Obtener detalle del carrito
        detalle_exist = DetalleCarrito.objects.filter(id_carrito=carrito.id, id_producto=producto.id)
        
        # Verifica si existe el producto en el carro, en caso de existir actualiza la cantidad   
        if detalle_exist:
            detalle = detalle_exist.get()
            detalle.cantidad += 1
            detalle.save()
            return Response(status=200)

        data = {
            'id_carrito': request.data['id_carrito'],
            'id_producto': producto.id,
            'nombre': producto.nombre,
            'precio': producto.precio,
            'cantidad': request.data['cantidad']
        }

        serializer = DetalleCarritoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=500)
        return Response(serializer.data, status=200)
    
    # Método DELETE para eliminar un detalle del carrito
    def delete(self, request, pk):
        try:
            detalle = DetalleCarrito.objects.get(id=pk)
            detalle.delete()
            return Response(status=200)
        except DetalleCarrito.DoesNotExist:
            return Response({"error": "Detalle no encontrado"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    # Método PATCH para actualizar un detalle del carrito
    def patch(self, request, pk=None):
        try:
            # Si se envía un solo producto (con `pk` en la URL)
            if pk:
                detalle = DetalleCarrito.objects.get(id=pk)
                for key, value in request.data.items():
                    if hasattr(detalle, key):
                        setattr(detalle, key, value)
                detalle.save()
                serializer = DetalleCarritoSerializer(detalle)
                return Response(serializer.data, status=200)

            # Si se envía una lista de productos (sin `pk` en la URL)
            else:
                productos = request.data.get("detalles", [])
                print(productos)
                if not isinstance(productos, list):
                    return Response({"error": "Se esperaba una lista de productos"}, status=400)

                detalles_actualizados = []
                for producto in productos:
                    detalle_id = producto.get("id")
                    if not detalle_id:
                        return Response({"error": "Cada producto debe incluir un ID"}, status=400)

                    try:
                        detalle = DetalleCarrito.objects.get(id=detalle_id)
                        for key, value in producto.items():
                            if hasattr(detalle, key):
                                setattr(detalle, key, value)
                        detalle.save()
                        detalles_actualizados.append(DetalleCarritoSerializer(detalle).data)
                    except DetalleCarrito.DoesNotExist:
                        return Response({"error": f"Detalle con ID {detalle_id} no encontrado"}, status=404)

                return Response({"detalles_actualizados": detalles_actualizados}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    

class ProductoView(generics.CreateAPIView):
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]
    def get(self, request, pk=None):

        if pk==None:
            productos = Producto.objects.all()
            data = [ProductoSerializer(producto).data for producto in productos]
            return Response(data, status=200)
        
        productos = Producto.objects.filter(codigo_ean=pk)
        data = [ProductoSerializer(prod).data for prod in productos]

        #data = ProductoSerializer(producto).data
        return Response(data, status=200)
    
    def post(self, request):
        productos = request.data["values"]

        for producto in productos:
            producto[2] = producto[2].replace(',','.')
            producto[2] = float(producto[2]) + 50
            producto[2] = str(producto[2])
            data = {
                'nombre': producto[1],
                'precio': producto[2],
                'codigo_ean': producto[0],
                'supermercado': 2
            }
            serializer = ProductoSerializer(data=data)
            if serializer.is_valid():
                serializer.save()        
        return Response(status=200)

class SupermercadoView(generics.CreateAPIView):
    serializer_class = SupermercadoSerializer
    permission_classes = [AllowAny]    
    def get(self, request, pk):
        supermercado = Supermercado.objects.get(id=pk)
        data = SupermercadoSerializer(supermercado).data
        return Response(data=data, status=200)


