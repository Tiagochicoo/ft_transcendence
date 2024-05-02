from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import User as User
from ..models import FriendRequest as FriendRequest
from ..serializers.serializers_friendrequest import FriendRequestSerializer

# POST sends data to the server.
# PATCH updates resources on the server.
# GET retrieves data from the server.

class FriendCreate(APIView):
    def post(self, request, format=None):
        user1 = request.data.get('user1')
        user2 = request.data.get('user2')
        try:
            friend_request = FriendRequest.objects.create(user1_id=user1, user2_id=user2)
            serializer = FriendRequestSerializer(friend_request)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
