from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from usuarios.models import Usuario
from servicios.models import Servicio

class Cita(models.Model):
    usuarioid = models.ForeignKey(Usuario, on_delete=models.CASCADE, default=1)
    servicioid = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    comentario = models.TextField(default='')
    fecha = models.DateTimeField()
    
    def clean(self):
        # Validar que la fecha no sea en el pasado
        if self.fecha and self.fecha < timezone.now():
            raise ValidationError('No se pueden crear citas en el pasado')
        
        # Validar que no haya citas duplicadas para el mismo servicio en la misma fecha
        citas_existentes = Cita.objects.filter(
            servicioid=self.servicioid,
            fecha=self.fecha
        ).exclude(id=self.id)
        
        if citas_existentes.exists():
            raise ValidationError('Ya existe una cita para este servicio en esta fecha y hora')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.usuarioid.nombre} - {self.servicioid.nombre} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        ordering = ['-fecha']
        verbose_name = 'Cita'
        verbose_name_plural = 'Citas' 