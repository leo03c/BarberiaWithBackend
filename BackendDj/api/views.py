from django_filters import rest_framework as filters
from rest_framework import viewsets
from .models import Producto
from .models import Cita
from .models import Cliente
from .models import Foto
from .models import Pago
from .models import Reseña
from .models import Promocion
from .models import Servicio
from .models import Trabajador
from .serializers import ProductoSerializer
from .serializers import CitaSerializer
from .serializers import ClienteSerializer
from .serializers import FotoSerializer
from .serializers import PagoSerializer
from .serializers import PromocionSerializer
from .serializers import ReseñaSerializer
from .serializers import TrabajadorSerializer
from .serializers import ServicioSerializer

# Create your views here.
class ProductoFilter(filters.FilterSet):
    class Meta:
        model = Producto  
        fields = ['producto', 'precio', 'calidad']

class TrabajadorFilter(filters.FilterSet):
    class Meta:
        model = Trabajador  
        fields = ['nombre', 'apellidos', 'ci','salario', 'puesto']

class ClienteFilter(filters.FilterSet):
    class Meta:
        model = Cliente  
        fields = ['nombre', 'apellidos', 'usuario','correo', 'telefono', 'password', 'enlace']

class FotoFilter(filters.FilterSet):
    class Meta:
        model = Foto 
        fields = ['nombre']

class ServicioFilter(filters.FilterSet):
    class Meta:
        model = Servicio  
        fields = ['nombre', 'precio', 'descripcion']

class CitaFilter(filters.FilterSet):
    class Meta:
        model = Cita  
        fields = ['clienteid', 'servicioid', 'fecha']

class PromocionFilter(filters.FilterSet):
    class Meta:
        model = Promocion  
        fields = ['nombre', 'descripcion']

class ReseñaFilter(filters.FilterSet):
    class Meta:
        model = Reseña  
        fields = ['clienteid', 'clasificacion', 'comentario']

class PagoFilter(filters.FilterSet):
    class Meta:
        model = Pago  
        fields = ['tarjeta', 'monto', 'clienteid']

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = ProductoFilter

class TrabajadorViewSet(viewsets.ModelViewSet):
    queryset = Trabajador.objects.all()
    serializer_class = TrabajadorSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = TrabajadorFilter

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = ClienteFilter

class FotoViewSet(viewsets.ModelViewSet):
    queryset = Foto.objects.all()
    serializer_class = FotoSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = FotoFilter

class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = ServicioFilter

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = CitaFilter

class PromocionViewSet(viewsets.ModelViewSet):
    queryset = Promocion.objects.all()
    serializer_class = PromocionSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = PromocionFilter

class ReseñaViewSet(viewsets.ModelViewSet):
    queryset = Reseña.objects.all()
    serializer_class = ReseñaSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = ReseñaFilter

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = PagoFilter

