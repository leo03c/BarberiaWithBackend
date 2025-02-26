from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'productos', views.ProductoViewSet, basename='productos')
router.register(r'clientes', views.ClienteViewSet, basename='clientes')
router.register(r'promociones', views.PromocionViewSet, basename='promociones')
router.register(r'reseñas', views.ReseñaViewSet, basename='reseñas')
router.register(r'pagos', views.PagoViewSet, basename='pagos')
router.register(r'fotos', views.FotoViewSet, basename='fotos')
router.register(r'servicios', views.ServicioViewSet, basename='servicios')
router.register(r'trabajadores', views.TrabajadorViewSet, basename='trabajadores')
router.register(r'citas', views.CitaViewSet, basename='citas')

urlpatterns = [
    path('', include(router.urls)),
]