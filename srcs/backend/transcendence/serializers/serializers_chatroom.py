from rest_framework import serializers
from ..models import ChatRoom
from .serializers_user import UserSerializer

class ChatRoomSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()
    user2 = UserSerializer()
    class Meta:
        model = ChatRoom
        fields = ['id', 'user1', 'user2', 'was_blocked', 'block_user']