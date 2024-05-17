from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Match, User
from ..serializers.serializers_match import MatchSerializer


class MatchCreate(APIView):
	def post(self, request):
		try:
			user1_id = request.data.get('user1').get('id')
			user1 = User.objects.get(pk=user1_id)
			user2_id = request.data.get('user2').get('id')
			user2 = User.objects.get(pk=user2_id)
			match = Match.objects.create(user1=user1, user2=user2, tournament=None, was_accepted=True)
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
		

class MatchDetail(APIView):
	def get(self, request, pk, format=None):
		match = Match.objects.get(pk=pk)
		serializer = MatchSerializer(match)
		return Response(serializer.data)