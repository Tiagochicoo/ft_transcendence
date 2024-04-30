from rest_framework import serializers
from ..models import FriendRequest

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['id', 'user1', 'user2', 'was_accepted', 'was_canceled', 'was_refused']
