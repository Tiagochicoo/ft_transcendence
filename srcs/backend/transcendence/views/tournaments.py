from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import TournamentUser as TournamentUser
from ..models import User as User
from ..serializers.serializers_tournaments import TournamentSerializer

class TournamentCreate(APIView):
    def post(self, request, format=None):

class TournamentStart(APIView):
    def patch(self, request, matchId, format=None):

class TournamentFinish(APIView):
    def patch(self, request, matchId, format=None):

class TournamentDetails(APIView):
    def get(self, request, matchId, format=None):

class UserTournamentDetails(APIView):
    def get(self, request, userId, format=None):
