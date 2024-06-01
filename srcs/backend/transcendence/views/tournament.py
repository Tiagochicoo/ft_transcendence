from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from ..models import User, Match, Tournament, TournamentUser
from ..serializers.serializers_match import MatchSerializer
from ..serializers.serializers_tournament import TournamentSerializer
from ..serializers.serializers_tournament_user import TournamentUserSerializer
from ..utils.access_token import get_user_id_from_request

class TournamentCreate(APIView):
	def post(self, request):
		try:
			creator_id = get_user_id_from_request(request)
			invited_user_ids = request.data.get('invited_user_ids')
			tournament = Tournament.objects.create(creator_id=creator_id)
			TournamentSerializer(tournament)
			tournament_user = TournamentUser.objects.create(tournament=tournament, user_id=creator_id, was_accepted=True)
			serializer_tournament_user = TournamentUserSerializer(tournament_user)
			for user_id in invited_user_ids:
				tournament_user = TournamentUser.objects.create(tournament=tournament, user_id=user_id)
				TournamentUserSerializer(tournament_user)
			return JsonResponse({'success': True, 'data': serializer_tournament_user.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentMatches(APIView):
	def get(self, request, tournamentId, format=None):
		try:
			tournament = Tournament.objects.get(pk=tournamentId)
			matches = Match.objects.filter(tournament=tournament).order_by('id')
			serializer = MatchSerializer(matches, many=True)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	def post(self, request, tournamentId, format=None):
		try:
			tournament = Tournament.objects.get(pk=tournamentId)
			matches = Match.objects.filter(tournament=tournament).order_by('id')
			tournament_users = TournamentUser.objects.filter(tournament=tournament).order_by('id')
			# Create Quarterfinals
			if (len(matches) == 0):
				i = 0
				while i < len(tournament_users):
					Match.objects.create(user1=tournament_users[i].user, user2=tournament_users[i + 1].user, tournament=tournament, was_accepted=True)
					i += 2
			# Create Semifinals
			elif (len(matches) == 4):
				Match.objects.create(user1=matches[0].winner, user2=matches[1].winner, tournament=tournament, was_accepted=True)
				Match.objects.create(user1=matches[2].winner, user2=matches[3].winner, tournament=tournament, was_accepted=True)
			# Create Finals
			elif (len(matches) == 6):
				Match.objects.create(user1=matches[4].winner, user2=matches[5].winner, tournament=tournament, was_accepted=True)
			else:
				raise Exception('Invalid batch of tournament batches')
			# Fetch batch of matches created
			matches = Match.objects.filter(tournament=tournament, has_finished=False)
			serializer = MatchSerializer(matches, many=True)
			tournament_users_serializer = TournamentUserSerializer(tournament_users, many=True)
			return JsonResponse({'success': True, 'data': serializer.data, 'tournament_users': tournament_users_serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentFinish(APIView):
	def post(self, request, tournamentId, format=None):
		try:
			tournament = Tournament.objects.get(pk=tournamentId)
			tournament_users = TournamentUser.objects.filter(tournament=tournament).order_by('id')
			matches = Match.objects.filter(tournament=tournament).order_by('id')

			did_all_matches_finish = all(match.has_finished for match in matches)
			if not did_all_matches_finish:
				raise Exception('Not all matches finished')

			tournament.has_finished = True
			tournament.winner = matches.last().winner
			tournament.save()

			ranking_dict = {}
			for tournament_user in tournament_users:
				ranking_dict[tournament_user.user_id] = 0
			for match in matches:
				ranking_dict[match.winner_id] += 100
				if match.winner_id == match.user1_id:
					ranking_dict[match.user2_id] += match.score
				if match.winner_id == match.user2_id:
					ranking_dict[match.user1_id] += match.score

			ranking_list = sorted(ranking_dict, key=ranking_dict.get, reverse=True)
			i = 0
			while i < len(ranking_list):
				tournament_user = TournamentUser.objects.get(tournament=tournament,user_id=ranking_list[i])
				tournament_user.position = i
				tournament_user.save()

				user = tournament_user.user
				user.num_tournaments += 1
				if user == tournament.winner:
					user.num_tournaments_won += 1
				user.save()

				i += 1

			serializer = TournamentSerializer(tournament)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentTournamentUserDetails(APIView):
	def get(self, request, tournamentId, format=None):
		try:
			tournament = Tournament.objects.get(pk=tournamentId)
			tournament_users = TournamentUser.objects.filter(tournament=tournament).order_by('id')
			serializer = TournamentUserSerializer(tournament_users, many=True)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserTournamentUserDetails(APIView):
	def get(self, request, userId, format=None):
		try:
			user = User.objects.get(pk=userId)
			tournament_users = TournamentUser.objects.filter(user=user)
			serializer = TournamentUserSerializer(tournament_users, many=True)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentUserAccept(APIView):
	def patch(self, request, tournamentUserId, format=None):
		try:
			tournament_user = TournamentUser.objects.get(pk=tournamentUserId)
			tournament_user.was_accepted = True
			tournament_user.save()
			# Check if tournament is ready to start
			# And if so: start it
			tournament_users = TournamentUser.objects.filter(tournament=tournament_user.tournament)
			if all(tournament_user.was_accepted for tournament_user in tournament_users):
				tournament = tournament_user.tournament
				tournament.has_started = True
				tournament.save()
			serializer = TournamentUserSerializer(tournament_user)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentUserRefuse(APIView):
	# Send list of all invites, not just the one from the user that requested it
	def patch(self, request, tournamentUserId, format=None):
		try:
			tournament_user = TournamentUser.objects.get(pk=tournamentUserId)
			tournament_users = tournament_user.tournament.tournament_users.all()
			for t_user in tournament_users:
				t_user.was_accepted = False
				t_user.was_canceled = True
				t_user.was_refused = False
				t_user.save()
			serializer = TournamentUserSerializer(tournament_users, many=True)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentDetail(APIView):
	def get(self, resquest, id, format=None):
		try:
			tournament = Tournament.objects.get(pk=id)
			serializer = TournamentSerializer(tournament)
			return Response(serializer.data)
		except Exception as error:
			return JsonResponse({'success': False, 'error': 'No tournament found.' }, status=status.HTTP_404_NOT_FOUND)
		
class TournamentUpdate(APIView):
	def patch(self, request):
		try:
			tournament = Tournament.objects.get(pk=request.data.get('id'))
			if 'hasStarted' in request.data:
				tournament.has_started = request.data.get('hasStarted')
			if 'winner' in request.data:
				tournament.winner = User.objects.get(pk=request.data.get('winner'))
			if 'hasFinished' in request.data:
				tournament.has_finished = request.data.get('hasFinished')
			tournament.save()
			serializer = TournamentSerializer(tournament)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
