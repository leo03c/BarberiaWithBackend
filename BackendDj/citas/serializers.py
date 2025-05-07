from rest_framework import serializers
from .models import Cita
from usuarios.models import Usuario
from servicios.models import Servicio
from usuarios.serializers import UsuarioSerializer
from servicios.serializers import ServicioSerializer

class CitaSerializer(serializers.ModelSerializer):
    usuarioid = UsuarioSerializer(read_only=True)
    servicioid = ServicioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source='usuarioid',
        write_only=True
    )
    servicio_id = serializers.PrimaryKeyRelatedField(
        queryset=Servicio.objects.all(),
        source='servicioid',
        write_only=True
    )

    class Meta:
        model = Cita
        fields = ['id', 'usuarioid', 'servicioid', 'usuario_id', 'servicio_id', 'comentario', 'fecha']

