from django_filters import rest_framework as filters
from rest_framework import viewsets
from .models import Usuario
from .models import Reseña
from .serializers import ReseñaSerializer

class ReseñaFilter(filters.FilterSet):
    class Meta:
        model = Reseña  
        fields = ['usuarioid', 'clasificacion', 'comentario']



class ReseñaViewSet(viewsets.ModelViewSet):
    queryset = Reseña.objects.all()
    serializer_class = ReseñaSerializer
    filter_backends = [filters.DjangoFilterBackend]  # Requiere django-filter
    filterset_class = ReseñaFilter
