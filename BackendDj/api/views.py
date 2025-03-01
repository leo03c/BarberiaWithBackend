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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from .serializers import CustomTokenObtainPairSerializer


from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class RegistroClienteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        
        if Cliente.objects.filter(usuario=data.get('usuario')).exists():
            return Response({"error": "El usuario ya está registrado"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cliente = Cliente.objects.create(
                nombre=data.get('nombre'),
                apellidos=data.get('apellidos'),
                usuario=data.get('usuario'),  
                correo=data.get('correo'),
                telefono=data.get('telefono', None),
                password=make_password(data.get('password')) 
            )

            cliente.save()
            return Response({"message": "Usuario registrado exitosamente"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




class CustomTokenObtainPairView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                }
            })
        return Response({'error': 'Credenciales inválidas'}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({'message': 'Acceso permitido'})