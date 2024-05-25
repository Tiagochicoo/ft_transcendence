from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Match, User, Tournament
from ..serializers.serializers_match import MatchSerializer


class MatchCreate(APIView):
	def post(self, request):
		try:
			user1_id = request.data.get('user1').get('id')
			user1 = User.objects.get(pk=user1_id)
			user2_id = request.data.get('user2').get('id')
			user2 = User.objects.get(pk=user2_id)
			if 'tournament' in request.data:
				tournament = Tournament.objects.get(pk=request.data.get('tournament'))
				match = Match.objects.create(user1=user1, user2=user2, tournament=tournament, was_accepted=True)
			else:
				match = Match.objects.create(user1=user1, user2=user2, was_accepted=True)
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		

class MatchDetail(APIView):
	def get(self, request, id, format=None):
		try:
			match = Match.objects.get(pk=id)
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False, 'error': 'No match found.'}, status=status.HTTP_404_NOT_FOUND)
		
class MatchUpdate(APIView):
	def patch(self, request):
		try:
			match = Match.objects.get(pk=request.data.get('matchId'))
			if 'wasAccepted' in request.data:
				match.was_accepted = request.data.get('wasAccepted')
			if 'score' in request.data:
				match.score = request.data.get('score')
				match.has_finished = True
			if 'winner' in request.data:
				match.winner = User.objects.get(pk=request.data.get('winner'))
			match.save()
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MatchByTournament(APIView):
	def get(self, request, tournament_id, format=None):
		response = []
		try:
			all_matches = Match.objects.all()
			for match in all_matches:
				if match.tournament != None and match.tournament.id == tournament_id:
					response.append(match)
			serializer = MatchSerializer(response, many=True)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False, 'error': 'No matches found.'}, status=status.HTTP_404_NOT_FOUND)
		