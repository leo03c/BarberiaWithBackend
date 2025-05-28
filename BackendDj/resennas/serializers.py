# reseñas/serializers.py
from rest_framework import serializers
from usuarios.serializers import UsuarioSerializer
from .models import Resenna
from usuarios.models import Usuario

class ResennaSerializer(serializers.ModelSerializer):
    # → 1)  Recibe solo el ID en alta/edición
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source='usuario',        #  hace el mapeo al FK «usuario»
        write_only=True
    )
    usuario = UsuarioSerializer(read_only=True)

    class Meta:
        model = Resenna
        fields = [
            'id',
            'usuario',      # salida
            'usuario_id',   # entrada (write-only)
            'clasificacion',
            'comentario',
        ]
        extra_kwargs = {
            'usuario_id': {'write_only': True}
        }
