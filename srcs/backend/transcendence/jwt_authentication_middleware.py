import jwt
from django.conf import settings
from django.http import JsonResponse
from django.urls import resolve
import logging
logger = logging.getLogger(__name__)
from transcendence.models import User

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.debug("JWTAuthenticationMiddleware: Called")
        authorization_header = request.headers.get('Authorization')
        # print(f"Authorization Header: {authorization_header}")

        # Skip JWT authentication for admin, media, sign-in, and sign-up URLs
        is_media_or_admin_route = any(map(lambda prefix: resolve(request.path_info).route.startswith(prefix), ['admin', '^media/']))
        if is_media_or_admin_route or ((request.method == 'POST') and (resolve(request.path_info).url_name in ['users', 'user_login', 'token_refresh'])):
            return self.get_response(request)

        if authorization_header:
            try:
                token = authorization_header.split(' ')[1]
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload['user_id']
                user = User.objects.get(id=user_id)
                request.user = user
                logger.debug(f"JWTAuthenticationMiddleware: Authenticated user {user.username}")
            except jwt.ExpiredSignatureError:
                print("Token has expired")
                return JsonResponse({'error': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                print("Invalid token")
                return JsonResponse({'error': 'Invalid token'}, status=401)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'Authorization header missing'}, status=401)

        return self.get_response(request)
