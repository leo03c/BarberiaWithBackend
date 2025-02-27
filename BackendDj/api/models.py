from django.db import models

# Create your models here.

class Trabajador(models.Model):

    nombre = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=150)
    ci = models.IntegerField(primary_key=True)
    salario = models.DecimalField( decimal_places=2,max_digits=6)
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
        return self.fecha
        
class Promocion(models.Model):
          
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre
    
class Reseña(models.Model):

    clienteid = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    clasificacion = models.IntegerField()
    comentario = models.TextField()
    
    def __str__(self):
        return self.clasificacion

   
class Pago(models.Model):

    tarjeta = models.IntegerField()
    monto = models.DecimalField(max_digits=5, decimal_places=2)
    clienteid = models.ForeignKey(Cliente, on_delete=models.CASCADE)

    def __str__(self):
        return self.tarjeta       

        