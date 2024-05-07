from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import User as User
from ..models import ChatRoom as ChatRoom
#from ..serializers.serializers_chatroom import ChatRoomSerializer


class ChatRoomCreate(APIView):
    def post(self, request, format=None):
Post /chat_rooms

class ChatRoomCancel(APIView):
    def patch(self, request, format=None):
Patch /chat_rooms/:chatRoomId/cancel

class ChatRoomAccept(APIView):
    def patch(self, request, format=None):
Patch /chat_rooms/:chatRoomId/accept

class ChatRoomRefuse(APIView):
    def patch(self, request, format=None):
Patch /chat_rooms/:chatRoomId/refuse

class ChatRoomBlock(APIView):
    def patch(self, request, format=None):
Patch /chat_rooms/:chatRoomId/block

class ChatRoomUnblock(APIView):
    def patch(self, request, format=None):
Patch /chat_rooms/:chatRoomId/unblock

class ChatRoomMessages(APIView):
    def patch(self, request, format=None):
Patch /chat_rooms/:chatRoomId/messages

class ChatRoomDetails(APIView):
    def get(self, request, format=None):
Get /chat_rooms/:chatRoomId

class UserChatRoomDetails(APIView):
    def get(self, request, format=None):
Get /users/:userId/chat_rooms