from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'servicios', views.ServicioViewSet, basename='servicios')

urlpatterns = [
    path('', include(router.urls)),
]