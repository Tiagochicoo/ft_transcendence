from rest_framework import serializers
from ..models import Tournament
from .serializers_user import UserSerializer

class TournamentSerializer(serializers.ModelSerializer):
	creator = UserSerializer()

	class Meta:
		model = Tournament
		fields = ['id', 'created_on', 'creator', 'winner', 'has_started', 'has_finished']