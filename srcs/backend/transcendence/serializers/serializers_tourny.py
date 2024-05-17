from rest_framework import serializers
from ..models import Tournament
from .serializers_user import UserSerializer

class TournySerializer(serializers.ModelSerializer):
    creator = UserSerializer()
    winner = UserSerializer()
    class Meta:
        model = Tournament
        fields = ['id', 'creator', 'winner', 'has_started', 'has_finished']

