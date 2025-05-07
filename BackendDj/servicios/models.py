from django.db import models

class Servicio(models.Model):
    nombre = models.CharField(max_length=100)                                     #unico
    precio = models.DecimalField(decimal_places=2,max_digits=7)
    descripcion = models.TextField()
    imag = models.ImageField(upload_to='servicio/', blank=True, null=True)
    
    def __str__(self):
        return self.nombre 