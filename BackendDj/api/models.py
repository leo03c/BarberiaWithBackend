from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
    
class Trabajador(models.Model):

    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=150)
    ci = models.IntegerField(primary_key=True)
    salario = models.IntegerField()
    puesto = models.CharField(max_length=100)
    
    def __str__(self):
        return self.nombre
    
class Producto(models.Model):

    producto = models.CharField(max_length=100)
    precio = models.DecimalField(decimal_places=2,max_digits=7)
    calidad = models.CharField(max_length=60)
    imag = models.ImageField(upload_to='productos/', blank=True, null=True)

    
    def __str__(self):
        return self.producto
    
    
class Cliente(models.Model):

    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=150)
    usuario = models.CharField(max_length=100)
    correo = models.EmailField(null=False)
    telefono = models.IntegerField(null=False)
    password = models.TextField(null=False)
    enlace = models.CharField(max_length=100)
    
    def save(self, *args, **kwargs):
        # Verifica si la contraseña NO está encriptada
        if not self.password.startswith('pbkdf2_sha256$'):
            # Encripta la contraseña
            self.password = make_password(self.password)
        super(Cliente, self).save(*args, **kwargs)

    def __str__(self):
        return self.nombre

class Foto(models.Model):

    nombre = models.CharField(max_length=100)
    imag = models.ImageField(upload_to='galeria/', blank=True, null=True)
    
    def __str__(self):
        return self.nombre

    
class Servicio(models.Model):

    nombre = models.CharField(max_length=100)
    precio = models.DecimalField(decimal_places=2,max_digits=7)
    descripcion = models.TextField()
    imag = models.ImageField(upload_to='servicio/', blank=True, null=True)
    
    def __str__(self):
        return self.nombre

class Cita(models.Model):
    
    clienteid  =models.ForeignKey(Cliente, on_delete=models.CASCADE)
    servicioid  =models.ForeignKey(Servicio, on_delete=models.CASCADE)
    fecha = models.DateTimeField(null=False)
    
        
    def __str__(self):
        return self.fecha.strftime("%Y-%m-%d %H:%M")  
        
class Promocion(models.Model):
          
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre
    
class Reseña(models.Model):
    clienteid = models.ForeignKey("Cliente", on_delete=models.CASCADE)
    clasificacion = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comentario = models.TextField()

    def __str__(self):
        return f"Reseña de {self.clienteid.nombre} - {self.clasificacion}★"
   
class Pago(models.Model):

    tarjeta = models.IntegerField()
    monto = models.DecimalField(max_digits=5, decimal_places=2)
    clienteid = models.ForeignKey(Cliente, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.tarjeta)      

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
       ('admin', 'Admin'),
       ('recepcionista', 'Recepcionista'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES,)

@receiver(post_save, sender=CustomUser)
def add_user_to_group(sender, instance, created, **kwargs):
    if created:  # Solo cuando el usuario es creado
        print(f"Usuario creado: {instance.username} con rol: {instance.role}")
        
        # Obtén o crea el grupo dependiendo del rol
        if instance.role == 'admin':
            group, created = Group.objects.get_or_create(name='Administración')
            instance.groups.add(group)  # Añadir al grupo
        elif instance.role == 'recepcionista':
            group, created = Group.objects.get_or_create(name='Recepcion')
            instance.groups.add(group)  # Añadir al grupo
        
        instance.save()  # Guardar el usuario con el grupo asignado
        print(f"Grupos actuales del usuario {instance.username}: {instance.groups.all()}")
