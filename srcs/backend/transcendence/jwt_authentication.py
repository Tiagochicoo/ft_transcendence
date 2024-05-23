from rest_framework import authentication
from rest_framework import exceptions
import jwt
from django.conf import settings
from transcendence.models import User

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return None

        try:
            # Typically, JWTs are passed as 'Bearer <token>'
            token = auth_header.split(' ')[1]
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('expired_token')

        except IndexError:
            raise exceptions.AuthenticationFailed('invalid_token')

        try:
            user = User.objects.get(id=payload['user_id'])
            if not user.is_active:
                raise exceptions.AuthenticationFailed('user_inactive')

        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('user_not_found')

        return (user, None)
