from django.db import models
from .user import User
from django.utils import timezone

class Tournament(models.Model):
	id = models.AutoField(primary_key=True)
	created_on = models.DateTimeField(default=timezone.now)
	creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_tournaments')
	winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='won_tournaments')
	has_started = models.BooleanField(default=False)
	has_finished = models.BooleanField(default=False)

	def __str__(self):
		return f"Tournament #{self.id} created by {self.creator}"
