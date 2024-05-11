from rest_framework import serializers
from ..models import ChatRoom
from ..models import Message
from .serializers_user import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'sender', 'content']