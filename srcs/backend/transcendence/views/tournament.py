from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from ..models import User, Tournament, TournamentUser
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

class TournamentTournamentUserDetails(APIView):
	def get(self, request, tournamentId, format=None):
		try:
			tournament = Tournament.objects.get(pk=tournamentId)
			tournament_users = TournamentUser.objects.filter(tournament=tournament)
			serializer = TournamentUserSerializer(tournament_users, many=True)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserTournamentDetails(APIView):
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
	def patch(self, request, tournamentUserId, format=None):
		try:
			tournament_user = TournamentUser.objects.get(pk=tournamentUserId)
			tournament_user.was_refused = True
			tournament_user.save()
			serializer = TournamentUserSerializer(tournament_user)
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
