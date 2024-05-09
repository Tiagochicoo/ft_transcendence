from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from ..serializers.serializers_user import UserSerializer
from ..models import User as User
import logging

# Create your views here.

logger = logging.getLogger(__name__)

class UserCreate(APIView):
    def post(self, request, *args, **kwargs):
        logger.info(f"Received data: {request.data}")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"User created successfully: {user.id}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=400)


class UserList(APIView):
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class UserDetail(APIView):
    def get(self, request, pk, format=None):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class UserUpdate(APIView):
    def put(self, request, pk, format=None):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDelete(APIView):
    def delete(self, request, pk, format=None):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(f"User with ID {pk} deleted successfully from DB", status=status.HTTP_200_OK)
