from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import ChatRoom as ChatRoom
from ..models import FriendRequest as FriendRequest
from ..models import User as User
from ..serializers.serializers_friendrequest import FriendRequestSerializer
from ..utils.access_token import get_user_id_from_request
from django.db.models import Q

# POST sends data to the server.
# PATCH updates resources on the server.
# GET retrieves data from the server.

class FriendCreate(APIView):
    def post(self, request, format=None):
        try:
            user1 = get_user_id_from_request(request)
            user2 = request.data.get('invited_user_id')
            #user1 = request.data.get('user1')
            #user2 = request.data.get('user2')
            if user1 == user2:
                raise Exception('cant_ask_yourself')

            already_exists = FriendRequest.objects.filter(user1=user1, user2=user2) | FriendRequest.objects.filter(user1=user2, user2=user1)
            if already_exists:
                existing_request = already_exists.filter(was_accepted=False, was_refused=False, was_canceled=False).first()
                if existing_request:
                    raise Exception('pending_friend_request')

                existing_request = already_exists.filter(was_accepted=True, was_refused=False, was_canceled=False).first()
                if existing_request:
                    raise Exception('is_already_friend')

                fr_refused_canceled = already_exists.filter(Q(was_refused=True) | Q(was_canceled=True)).first()
                if fr_refused_canceled:
                    fr_refused_canceled.was_refused = False
                    fr_refused_canceled.was_canceled = False
                    fr_refused_canceled.was_accepted = False
                    fr_refused_canceled.save()
                    serializer = FriendRequestSerializer(fr_refused_canceled)
                    return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)

            chat_room = ChatRoom.objects.create(user1_id=user1, user2_id=user2)
            friend_request = FriendRequest.objects.create(user1_id=user1, user2_id=user2, chat_room=chat_room)
            serializer = FriendRequestSerializer(friend_request)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False, 'message': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FriendCancel(APIView):
    def patch(self, request, friendRequestId, format=None):
        try:
            friend_request = FriendRequest.objects.get(pk=friendRequestId)
            friend_request.was_canceled = True
            friend_request.save()
            serializer = FriendRequestSerializer(friend_request)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FriendAccept(APIView):
    def patch(self, request, friendRequestId, format=None):
        try:
            friend_request = FriendRequest.objects.get(pk=friendRequestId)
            friend_request.was_accepted = True
            friend_request.save()
            serializer = FriendRequestSerializer(friend_request)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FriendRefuse(APIView):
    def patch(self, request, friendRequestId, format=None):
        try:
            friend_request = FriendRequest.objects.get(pk=friendRequestId)
            friend_request.was_refused = True
            friend_request.save()
            serializer = FriendRequestSerializer(friend_request)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FriendDetails(APIView):
    def get(self, request, friendRequestId, format=None):
        try:
            friend_request = FriendRequest.objects.get(pk=friendRequestId)
            serializer = FriendRequestSerializer(friend_request)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserFriendDetails(APIView):
    def get(self, request, userId, format=None):
        try:
            user = User.objects.get(pk=userId)
            friend_requests = FriendRequest.objects.filter(user1=user) | FriendRequest.objects.filter(user2=user)
            serializer = FriendRequestSerializer(friend_requests, many=True)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
