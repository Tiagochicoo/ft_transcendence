from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import Match, User, Tournament
from ..serializers.serializers_match import MatchSerializer
from ..utils.access_token import get_user_id_from_request

class MatchCreate(APIView):
	def post(self, request):
		try:
			user1 = get_user_id_from_request(request)
			user2 = request.data.get('invited_user_id')
			if 'tournament' in request.data:
				tournament = Tournament.objects.get(pk=request.data.get('tournament'))
				match = Match.objects.create(user1_id=user1, user2_id=user2, tournament=tournament, was_accepted=True)
			else:
				match = Match.objects.create(user1_id=user1, user2_id=user2)
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_400_BAD_REQUEST)

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
			return JsonResponse({'success': False}, status=status.HTTP_400_BAD_REQUEST)

class MatchCancel(APIView):
	def patch(self, request, MatchId, format=None):
		try:
			match = Match.objects.get(pk=MatchId)
			match.was_canceled = True
			match.save()
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_400_BAD_REQUEST)

class MatchAccept(APIView):
	def patch(self, request, MatchId, format=None):
		try:
			match = Match.objects.get(pk=MatchId)
			match.was_accepted = True
			match.save()
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_400_BAD_REQUEST)

class MatchRefuse(APIView):
	def patch(self, request, MatchId, format=None):
		try:
			match = Match.objects.get(pk=MatchId)
			match.was_refused = True
			match.save()
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_400_BAD_REQUEST)

class MatchFinish(APIView):
	def patch(self, request, MatchId, format=None):
		try:
			match = Match.objects.get(pk=MatchId)
			if (match.has_finished):
				raise Exception('Match already finished')
			match.has_finished = True
			user1 = match.user1
			user2 = match.user2
			user1.num_games += 1
			user2.num_games += 1
			user1_score = request.data.get('user1_score')
			user2_score = request.data.get('user2_score')
			match.score = abs(user1_score - user2_score)
			if (user1_score > user2_score):
				match.winner = match.user1
				user1.num_games_won += 1
			else:
				match.winner = match.user2
				user2.num_games_won += 1
			user1.save()
			user2.save()
			match.save()
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_400_BAD_REQUEST)

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

class UserMatchDetails(APIView):
	def get(self, request, userId, format=None):
		try:
			user = User.objects.get(pk=userId)
			matches = Match.objects.filter(user1=user) | Match.objects.filter(user2=user)
			serializer = MatchSerializer(matches, many=True)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_404_NOT_FOUND)
