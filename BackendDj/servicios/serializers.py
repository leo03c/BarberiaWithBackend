from rest_framework import serializers
from .models import Servicio
from datetime import timedelta

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

    def validate_precio(self, precio):
        if precio <= 0:
            raise serializers.ValidationError("El precio debe ser mayor que cero.")
        return precio
    
    def validate_duracion(self, value):
       
        if value <= timedelta(hours=1):
            raise serializers.ValidationError("La duración debe ser mayor a 1 hora.")
        return value
    
    def validate_imagen(self, value):
        if value and not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("La imagen debe ser un archivo JPG o PNG.")
        
        if value== None:
            raise serializers.ValidationError("La imagen es obligatoria.")
        return value