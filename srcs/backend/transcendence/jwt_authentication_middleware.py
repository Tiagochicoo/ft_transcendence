import jwt
from django.conf import settings
from django.http import JsonResponse
from django.urls import resolve

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print("JWTAuthenticationMiddleware is processing a request.")
        authorization_header = request.headers.get('Authorization')
        print(f"Authorization Header: {authorization_header}")

        # Skip JWT authentication for admin, sign-in, and sign-up URLs
        skip_urls = ['admin', 'sign-in', 'create_user', 'sign-up']
        if resolve(request.path_info).url_name and any(url in resolve(request.path_info).route for url in skip_urls):
            return self.get_response(request)

        if authorization_header:
            try:
                token = authorization_header.split(' ')[1]
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                request.user_id = payload['user_id']
                print("Payload decoded successfully: {}".format(payload))
            except jwt.ExpiredSignatureError:
                print("Token has expired")
                return JsonResponse({'error': 'Token has expired'}, status=401)
            except jwt.InvalidTokenError:
                print("Invalid token")
                return JsonResponse({'error': 'Invalid token'}, status=401)
            except Exception as e:
                print(f"Unexpected error: {e}")
                return JsonResponse({'error': str(e)}, status=500)
        else:
            print("Authorization header missing")
            return JsonResponse({'error': 'Authorization header missing'}, status=401)

        response = self.get_response(request)
        return response
