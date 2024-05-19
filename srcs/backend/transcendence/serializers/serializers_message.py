from rest_framework import serializers
from ..models import ChatRoom
from ..models import Message
from .serializers_chatroom import ChatRoomSerializer
from .serializers_user import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    chat_room = ChatRoomSerializer()
    class Meta:
        model = Message
        fields = ['id', 'created_at', 'chat_room', 'sender', 'content']