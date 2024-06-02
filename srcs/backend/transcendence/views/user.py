from django.db.models import Q
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import Match, User
from ..serializers.serializers_match import MatchSerializer
from ..serializers.serializers_tournament_user import TournamentUserSerializer
from ..serializers.serializers_user import UserSerializer
from ..serializers.serializers_signin import SignInSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

class WhoAmI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve session data
        session_data = dict(request.session.items())
        
        # Prepare user information if the user is authenticated
        if request.user.is_authenticated:
            user_info = {
                'username': request.user.username,
                'user_id': request.user.id,
                'is_active': request.user.is_active
            }
        else:
            user_info = {'message': 'User is not authenticated'}

        # Include session data in the response
        return Response({
            'message': 'This is a protected view',
            'user_info': user_info,
            'session_data': session_data  # Display session data for debugging
        })

class UserList(APIView):
    def get(self, request, format=None):
        try:
            users = User.objects.all()
            query_username = request.GET.get('username', '')
            if (query_username):
                users = users.filter(username=query_username)
            serializer = UserSerializer(users, many=True)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_201_CREATED)
            else:
                return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetails(APIView):
    def get(self, request, userId, format=None):
        try:
            user = User.objects.get(pk=userId)
            serializer = UserSerializer(user)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, userId, format=None):
        try:
            user = User.objects.get(pk=userId)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
            return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDashboard(APIView):
    def get(self, request, userId, format=None):
        try:
            user = User.objects.get(pk=userId)
            serializer_user = UserSerializer(user)
            matches = Match.objects.filter(Q(user1=user) | Q(user2=user))
            serializer_matches = MatchSerializer(matches, many=True)
            tournament_users = user.tournament_users.all()
            serializer_tournament_users = TournamentUserSerializer(tournament_users, many=True)
            data = {
                'user': serializer_user.data,
                'matches': serializer_matches.data,
                'tournament_users': serializer_tournament_users.data
            }
            return JsonResponse({'success': True, 'data': data}, status=status.HTTP_200_OK)
        except Exception as error:
            print(error)
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserLogin(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = SignInSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'success': True,
                    'data': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                        'user_id': user.id,
                    }
                }, status=status.HTTP_200_OK)
            return JsonResponse({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
