import base64
import json

def get_user_id_from_request(request):
    token = request.headers.get("x-access-token")
    payload = json.loads(base64.b64decode(token.split('.')[1] + '===').decode('utf-8'))
    return payload.get('user_id')
