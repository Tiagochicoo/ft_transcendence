from rest_framework import serializers
from ..models import Match
from .serializers_user import UserSerializer

class MatchSerializer(serializers.ModelSerializer):
	user1 = UserSerializer()
	user2 = UserSerializer()

	class Meta:
		model = Match
		fields = ['id', 'created_on', 'user1', 'user2', 'tournament', 'was_accepted', 'was_canceled', 'was_refused', 'has_finished', 'score']
