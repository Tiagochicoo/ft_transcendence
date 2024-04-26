from django.db import models
from .tournament import Tournament
from .user import User

class Match(models.Model):
	user1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='matches_as_user1')
	user2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='matches_as_user2')
	tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, related_name='matches')
	was_accepted = models.BooleanField(default=False)
	was_canceled = models.BooleanField(default=False)
	was_refused = models.BooleanField(default=False)
	has_finished = models.BooleanField(default=False)
	score = models.IntegerField(default=0)

	def __str__(self):
		return f"Match of {self.user1} with {self.user2}"
