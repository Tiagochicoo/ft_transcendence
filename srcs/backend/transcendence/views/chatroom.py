from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import User as User
from ..models import ChatRoom as ChatRoom
from ..models import Message as Message
from ..serializers.serializers_chatroom import ChatRoomSerializer
from ..serializers.serializers_message import MessageSerializer
from ..utils.access_token import get_user_id_from_request

class ChatRoomCreate(APIView):
    def post(self, request, format=None):
        try:
            user1 = request.data.get('user1')
            user2 = request.data.get('user2')
            chat_room = ChatRoom.objects.create(user1_id=user1, user2_id=user2)
            serializer = ChatRoomSerializer(chat_room)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatRoomBlock(APIView):
    # TODO: Setup the 'block_user' field
    def patch(self, request, chatRoomId, format=None):
        try:
            chat_room = ChatRoom.objects.get(pk=chatRoomId)
            chat_room.was_blocked = True
            chat_room.save()
            serializer = ChatRoomSerializer(chat_room)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatRoomUnblock(APIView):
    # TODO: Setup the 'block_user' field
    def patch(self, request, chatRoomId, format=None):
        try:
            chat_room = ChatRoom.objects.get(pk=chatRoomId)
            chat_room.was_blocked = False
            chat_room.save()
            serializer = ChatRoomSerializer(chat_room)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatRoomMessages(APIView):
    def get(self, request, chatRoomId, format=None):
        try:
            chat_room = ChatRoom.objects.get(pk=chatRoomId)
            messages = Message.objects.filter(chat_room=chat_room)
            serializer = MessageSerializer(messages, many=True)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, chatRoomId, format=None):
        try:
            chat_room = ChatRoom.objects.get(pk=chatRoomId)
            content = request.data.get('content')
            user_id = get_user_id_from_request(request)
            message = Message.objects.create(chat_room=chat_room, content=content, sender_id=user_id)
            serializer = MessageSerializer(message)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatRoomDetails(APIView):
    def get(self, request, chatRoomId, format=None):
        try:
            chat_room = ChatRoom.objects.get(pk=chatRoomId)
            serializer = ChatRoomSerializer(chat_room)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserChatRoomDetails(APIView):
    def get(self, request, userId, format=None):
        try:
            user = User.objects.get(pk=userId)
            chat_room = ChatRoom.objects.filter(user1=user) | ChatRoom.objects.filter(user2=user)
            serializer = ChatRoomSerializer(chat_room, many=True)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
