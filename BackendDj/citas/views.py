from django_filters import rest_framework as filters
from rest_framework import viewsets


from .models import Cita
from .serializers import CitaSerializer


class CitaFilter(filters.FilterSet):
    class Meta:
        model = Cita  
        fields = ['usuarioid', 'servicioid', 'fecha']

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = CitaFilter

