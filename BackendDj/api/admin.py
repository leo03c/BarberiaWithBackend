from django.contrib import admin

from .models import Cita
from .models import Usuario
from .models import Foto
from .models import Promocion
from .models import Reseña
from .models import Paquete
from .models import Trabajador

# Register your models here.


admin.site.register(Cita)
admin.site.register(Usuario)
admin.site.register(Foto)
admin.site.register(Promocion)
admin.site.register(Reseña)
admin.site.register(Paquete)
admin.site.register(Trabajador)
