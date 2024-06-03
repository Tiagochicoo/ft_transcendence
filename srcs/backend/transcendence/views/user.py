from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User
from ..serializers.serializers_user import UserSerializer
from ..serializers.serializers_signin import SignInSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import logging
import pyotp
import qrcode
from io import BytesIO
import base64

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

class UserLogin(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = SignInSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.validated_data['user']

                if user.is_2fa_enabled:
                    return JsonResponse({
                        'success': True,
                        '2fa_required': True,
                        'user_id': user.id,
                    }, status=status.HTTP_200_OK)

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

class UserUpdate(APIView):
    def patch(self, request):
        try:
            user = User.objects.get(pk=request.data.get('userId'))
            if 'numGames' in request.data:
                user.num_games += request.data.get('numGames')
            if 'numGamesWon' in request.data:
                user.num_games_won += request.data.get('numGamesWon')
            user.save()
            serializer = UserSerializer(user)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class Verify2FAView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        two_factor_code = request.data.get('two_factor_code')
        user = User.objects.get(id=user_id)

        if user and user.verify_2fa_code(two_factor_code):
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'success': True,
                'data': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.id,
                }
            }, status=status.HTTP_200_OK)

        return JsonResponse({'success': False, 'errors': {'two_factor_code': ['invalid_2fa_code']}}, status=status.HTTP_401_UNAUTHORIZED)
    
class Generate2FASecretView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if not user.two_factor_code:
            user.two_factor_code = pyotp.random_base32()
            user.save()

        totp = pyotp.TOTP(user.two_factor_code)
        otp_auth_url = totp.provisioning_uri(name=user.email, issuer_name="Transcendence")

        qr = qrcode.make(otp_auth_url)
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()

        return Response({
            'qr_code': qr_code_base64,
            'otp_auth_url': otp_auth_url
        })