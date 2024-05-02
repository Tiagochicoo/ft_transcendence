from rest_framework import serializers
from ..models import FriendRequest
from .serializers_user import UserSerializer

class FriendRequestSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()
    user2 = UserSerializer()
    class Meta:
        model = FriendRequest
        fields = ['id', 'user1', 'user2', 'was_accepted', 'was_canceled', 'was_refused']
