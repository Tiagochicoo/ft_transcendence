from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from ..models import Match as Match
from ..serializers.serializers_match import MatchSerializer


class MatchCreate(APIView):
	def post(self, request):
		print(request)
		try:
			user1 = request.data.get('user1')
			user2 = request.data.get('user2')
			match = Match.objects.create(user1=user1, user2=user2, tournament=None, was_accepted=True)
			serializer = MatchSerializer(match)
			return JsonResponse({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
		except Exception as error:
			return JsonResponse({'success': False}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)