from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import User as User
from ..models import Match as Match
from ..serializers.serializers_matches import MatchSerializer

class MatchCreate(APIView):
    def post(self, request, format=None):

class MatchCancel(APIView):
    def patch(self, request, matchId, format=None):

class MatchAccept(APIView):
    def patch(self, request, matchId, format=None):

class MatchRefuse(APIView):
    def patch(self, request, matchId, format=None):

class MatchFinish(APIView):
    def patch(self, request, matchId, format=None):

class MatchDetails(APIView):
    def get(self, request, matchId, format=None):

class UserMatchDetails(APIView):
    def get(self, request, userId, format=None):
