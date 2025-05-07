from django.db import models
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=150)
    usuario = models.CharField(max_length=100)                                  #unico
    correo = models.EmailField(null=False)
    telefono = models.IntegerField(null=False)
    password = models.TextField(null=False)
    rol = models.CharField(
        max_length=100,
        default='cliente',  # Valor por defecto
        choices=[('cliente', 'Cliente'), ('admin', 'Admin')]  
    )
    
    def save(self, *args, **kwargs):
        # Verifica si la contraseña NO está encriptada
        if not self.password.startswith('pbkdf2_sha256$'):
            # Encripta la contraseña
            self.password = make_password(self.password)
        super(Usuario, self).save(*args, **kwargs)

    def __str__(self):
        return self.nombre 