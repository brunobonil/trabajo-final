"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from carrito_backend.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('crear-carrito/', CarritoView.as_view()),
    path('listar-carritos/<int:pk>', CarritoView.as_view()),
    path('listar-productos/<int:pk>/', ProductoView.as_view()),
    path('listar-productos/', ProductoView.as_view()),
    path('crear-detalle/', DetalleCarritoView.as_view()),
    path('listar-detalles/<int:pk>/', DetalleCarritoView.as_view()),
    path('listar-detalles/', DetalleCarritoView.as_view()),

]
