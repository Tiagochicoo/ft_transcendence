from rest_framework import serializers
from ..models import TournamentUser
from .serializers_tournament import TournamentSerializer
from .serializers_user import UserSerializer

class TournamentUserSerializer(serializers.ModelSerializer):
	tournament = TournamentSerializer()
	user = UserSerializer()

	class Meta:
		model = TournamentUser
		fields = ['id', 'tournament', 'user', 'was_accepted', 'was_canceled', 'was_refused', 'position']