from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from ..models import User, Tournament, TournamentUser
from django.http import JsonResponse
from ..serializers.serializers_tournament_user import TournamentUserSerializer

class TournamentUserCreate(APIView):
	def post(sel, request):
		try:
			tournament_id = request.data.get('tournamentId')
			tournament = Tournament.objects.get(pk=tournament_id)
			user_id = request.data.get('userId')
			user = User.objects.get(pk=user_id)
			tournament_user = TournamentUser.objects.create(tournament=tournament, user=user)
			serializer = TournamentUserSerializer(tournament_user)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentUserDetail(APIView):
	def get(self, request, tournament_id, format=None):
		response = []
		try:
			all = TournamentUser.objects.all()
			for elem in all:
				if elem.tournament.id == tournament_id:
					response.append(elem)
			serializer = TournamentUserSerializer(response, many=True)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False, 'error': 'No tournament_user found.'}, status=status.HTTP_404_NOT_FOUND)