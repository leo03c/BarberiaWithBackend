from rest_framework import serializers
from .models import  Usuario
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password




class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        try:
            user = Usuario.objects.get(usuario=username)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError('Usuario o contraseña incorrectos.')

        if not check_password(password, user.password):
            raise serializers.ValidationError('Usuario o contraseña incorrectos.')

        refresh = RefreshToken.for_user(user)
        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['user'] = {
            'id': user.id,
            'username': user.usuario,
            'email': user.correo,
            'rol': user.rol,  # Se incluye el rol para la lógica en el frontend
        }

        return data


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'


