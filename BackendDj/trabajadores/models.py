from django.db import models

class Trabajador(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=150)
    ci = models.IntegerField(primary_key=True)                                   #unico
    salario = models.IntegerField()
    puesto = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre 