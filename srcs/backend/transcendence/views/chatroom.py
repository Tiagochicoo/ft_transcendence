from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import User as User
from ..models import ChatRoom as ChatRoom
from ..serializers.serializers_chatroom import ChatRoomSerializer

class ChatRoomCreate(APIView):
    def post(self, request, format=None):
        user1 = request.data.get('user1')
        user2 = request.data.get('user2')
         try:
            chat_room = ChatRoom.objects.create(user1_id=user1, user2_id=user2)
            serializer = ChatRoomSerializer(chat_room)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatRoomBlock(APIView):
    def patch(self, request, chatRoomId, format=None):
        try:
            chat_room = ChatRoom.objects.get(pk=chatRoomId)
            chat_room.was_blocked = True
            chat_room.save()
            serializer = FriendRequestSerializer(chat_room)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatRoomUnblock(APIView):
    def patch(self, request, chatRoomId, format=None):
        try:
            chat_room = ChatRoom.objects.get(pk=chatRoomId)
            chat_room.was_blocked = False
            chat_room.save()
            serializer = FriendRequestSerializer(chat_room)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatRoomCancel(APIView):
    def patch(self, request, chatRoomId, format=None):

class ChatRoomAccept(APIView):
    def patch(self, request, chatRoomId, format=None):

class ChatRoomRefuse(APIView):
    def patch(self, request, chatRoomId, format=None):




class ChatRoomMessages(APIView):
    def get(self, request, chatRoomId, format=None):
    def patch(self, request, chatRoomId, format=None):

class ChatRoomDetails(APIView):
    def get(self, request, chatRoomId, format=None):
        try:
            chat_room = ChatRoom.objects.get(pk=chatRoomId)
            serializer = FriendRequestSerializer(chat_room)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserChatRoomDetails(APIView):
    def get(self, request, userId, format=None):
        try:
            user = User.objects.get(pk=userId)
            chat_room = ChatRoom.objects.filter(user1=user) | ChatRoom.objects.filter(user2=user)
            serializer = FriendRequestSerializer(chat_room, many=True)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)