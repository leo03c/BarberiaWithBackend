from rest_framework import serializers
from .models import Producto
from .models import Cita
from .models import Cliente
from .models import Foto
from .models import Promocion
from .models import Reseña
from .models import Servicio
from .models import Trabajador
from .models import Pago
from rest_framework import serializers
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password


class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        
        users = Cliente.objects.filter(usuario=username)
        if not users.exists():
            raise serializers.ValidationError('Usuario o contraseña incorrectos.')

        user = users.first()  

      
        if not check_password(password, user.password):
            raise serializers.ValidationError('Usuario o contraseña incorrectos.')

  
        refresh = RefreshToken.for_user(user)
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)

        data['user'] = {
            'id': user.id,
            'username': user.usuario,
            'email': user.correo,
        }

        return data

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'

class ReseñaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reseña
        fields = '__all__'

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = '__all__'

class FotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Foto
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = '__all__'

class PromocionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promocion
        fields = '__all__'