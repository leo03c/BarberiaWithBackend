from django.db import models
from servicios.models import Servicio

class Promocion(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    porcientoDesc = models.IntegerField()

    def __str__(self):
        return self.nombre 