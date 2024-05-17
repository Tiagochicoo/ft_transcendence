from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import User as User
from ..models import Match as Match
from ..serializers.serializers_matches import MatchSerializer

class MatchCreate(APIView):
    def post(self, request, format=None):
        try:
            user1 = request.data.get('user1')
            user2 = request.data.get('user2')
            tournament = request.data.get('tournament')
            match = Match.objects.create(user1_id=user1, user2_id=user2, tournament_id=tournament)
            serializer = MatchSerializer(match)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MatchCancel(APIView):
    def patch(self, request, matchId, format=None):
        try:
            match = Match.objects.get(pk=matchId)
            match.was_canceled = True
            match.save()
            serializer = MatchSerializer(match)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MatchAccept(APIView):
    def patch(self, request, matchId, format=None):
        try:
            match = Match.objects.get(pk=matchId)
            match.was_accepted = True
            match.save()
            serializer = MatchSerializer(match)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MatchRefuse(APIView):
    def patch(self, request, matchId, format=None):
        try:
            match = Match.objects.get(pk=matchId)
            match.was_refused = True
            match.save()
            serializer = MatchSerializer(match)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MatchFinish(APIView):
    def patch(self, request, matchId, format=None):
        try:
            match = Match.objects.get(pk=matchId)
            match.has_finished = True
            match.save()
            serializer = MatchSerializer(match)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MatchDetails(APIView):
    def get(self, request, matchId, format=None):
        try:
            match = Match.objects.get(pk=matchId)
            serializer = MatchSerializer(match)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserMatchDetails(APIView):
    def get(self, request, userId, format=None):
        try:
            user = User.objects.get(pk=userId)
            match = Match.objects.filter(user1=user) | Match.objects.filter(user2=user)
            serializer = MatchSerializer(match, many=True)
            return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as error:
            return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
