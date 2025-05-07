from django.db import models

class Producto(models.Model):
    nombre = models.CharField(max_length=100)                #unico
    precio = models.DecimalField(decimal_places=2,max_digits=7)
    calidad = models.CharField(max_length=60)
    cantidad = models.IntegerField(default=0)
    imag = models.ImageField(upload_to='productos/', blank=True, null=True)

    def __str__(self):
        return self.nombre 