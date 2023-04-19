from django.shortcuts import render
from rest_framework.response import Response 
from rest_framework import generics 
from .serializers import *
from .models import *

# Create your views here.

class CarritoView(generics.CreateAPIView):
    serializer_class = CarritoSerializer
    model = Carrito

    def get(self, request):
        carritos = Carrito.objects.all()
        data = [CarritoSerializer(carrito).data for carrito in carritos]
        return Response(data, status=200)

    def post(self, request):
        serializer = CarritoSerializer(data={})

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=500)
        return Response(serializer.data, status=200)
    


    
