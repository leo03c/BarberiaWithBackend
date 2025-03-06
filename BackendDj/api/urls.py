from django.urls import path, include
from rest_framework import routers
from . import views
from .views import CustomTokenObtainPairView, RegistroClienteView

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
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('registro/', RegistroClienteView.as_view(), name='registro_cliente'),
]