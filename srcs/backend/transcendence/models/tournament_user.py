from django.db import models
from .tournament import Tournament
from .user import User

class TournamentUser(models.Model):
	tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True, related_name='tournament_users')
	user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='tournament_users')
	was_accepted = models.BooleanField(default=False)
	was_canceled = models.BooleanField(default=False)
	was_refused = models.BooleanField(default=False)
	position = models.IntegerField(default=0)

	def __str__(self):
		return f"TournamentUser for {self.user} in Tournament #{self.tournament.id}"
