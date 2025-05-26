from rest_framework import serializers
from .models import Trabajador
from datetime import datetime

class TrabajadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trabajador
        fields = '__all__'


    def validate_ci(self,ci) -> bool:
       
        if len(ci) != 11:
            raise serializers.ValidationError('Ingrese un carnet valido')

      
        fecha_nacimiento = ci[:6]

        # Verificar que los primeros 6 dígitos sean numéricos
        if not fecha_nacimiento.isdigit():
            raise serializers.ValidationError('Ingrese un carnet valido')

        año = int(fecha_nacimiento[:2])  # Los primeros 2 dígitos (Año)
        mes = int(fecha_nacimiento[2:4])  # Los siguientes 2 dígitos (Mes)
        dia = int(fecha_nacimiento[4:6])  # Los últimos 2 dígitos (Día)

        # Comprobar que el mes sea válido (debe estar entre 01 y 12)
        if not (1 <= mes <= 12):
            raise serializers.ValidationError('Ingrese un carnet valido')

        if not (0 <= dia <= 31):
            raise serializers.ValidationError('Ingrese un carnet valido')

       
        return ci
    
    def validate_salario(self,salario):
        if salario < 0:
            raise serializers.ValidationError("EL salario no puede ser nefativo") 
    
        return salario
        