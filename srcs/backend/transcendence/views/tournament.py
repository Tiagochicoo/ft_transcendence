from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from ..models import User, Tournament
from django.http import JsonResponse
from ..serializers.serializers_tournament import TournamentSerializer

class TournamentCreate(APIView):
	def post(self, request):
		try:
			creator = User.objects.get(pk=request.data.get('creator'))
			tournament = Tournament.objects.create(creator=creator)
			serializer = TournamentSerializer(tournament)
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
				tournament.winner = request.data.get('winner')
			if 'hasFinished' in request.data:
				tournament.has_finished = request.data.get('hasFinished')
			tournament.save()
			serializer = TournamentSerializer(tournament)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
