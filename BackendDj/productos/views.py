from django_filters import rest_framework as filters
from rest_framework import viewsets
from .models import Producto
from .serializers import ProductoSerializer


# Create your views here.
class ProductoFilter(filters.FilterSet):
    class Meta:
        model = Producto  
        fields = ['nombre', 'precio', 'calidad']


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = ProductoFilter

