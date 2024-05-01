from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from .serializers.serializers_friendrequest import FriendRequestSerializer
from .models import User as User
from .models import FriendRequest as FriendRequest


"""
Shell Testing configure
docker exec -it container python3 manage.py shell
from transcendence.models import User
user1 = User.objects.create(email='user1@gmai.com', password='123abc', username='user1')
user2 = User.objects.create(email='2user2@gmai.com', password='222aaa', username='user2')
User.objects.all()
User.objects.filter(id=id).delete()
for user in User.objects.all():
print(f"ID:{user.id}, Email: {user.email}, Password: {user.password}, Username: {user.username}")

from transcendence.models import FriendRequest
friend_request = FriendRequest.objects.create(user1=id, user2=id)
"""

#POST sends data to the server. 
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

#PATCH updates resources on the server. 
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

#GET retrieves data from the server
class FriendDetail(APIView):
    def get(self, request, friendRequestId, format=None):
        try:
            friend_request = FriendRequest.objects.get(pk=friendRequestId)
            serializer = FriendRequestSerializer(friend_request)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#many = multiple instances
class UserFriendRequests(APIView):
    def get(self, request, userId, format=None):
        try:
            user = User.objects.get(pk=userId)
            friend_requests = FriendRequest.objects.filter(user1=user) | FriendRequest.objects.filter(user2=user)
            serializer = FriendRequestSerializer(friend_requests, many=True)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)