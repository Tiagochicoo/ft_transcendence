from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import Match as Match
from ..models import User as User
#from ..serializers.serializers_friendrequest import FriendRequestSerializer

Post /tournaments
PATCH /tournaments/:tournamentId/start
PATCH /tournaments/:tournamentId/finish
GET /tournaments/:tournamentId
GET /users/:userId/tournaments
