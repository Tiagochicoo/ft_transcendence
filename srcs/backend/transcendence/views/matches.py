from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import User as User
from ..models import Match as Match
#from ..serializers.serializers_friendrequest import FriendRequestSerializer

Post /matches
PATCH /matches/:matchid/cancel    
PATH /matches/:matchId/accept      
PATCH /matches/:matchId/refuse      
PATCH /matches/:matchId/finish     
GET  /matches/:matchId