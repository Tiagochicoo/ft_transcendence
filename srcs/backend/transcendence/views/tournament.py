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
			serializer_tournament = TournamentSerializer(tournament)
			for user_id in invited_user_ids:
				tournament_user = TournamentUser.objects.create(tournament=tournament, user_id=user_id)
				TournamentUserSerializer(tournament_user)
			return JsonResponse({'success': True, 'data': serializer_tournament.data}, status=status.HTTP_200_OK)
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
