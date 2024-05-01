from django.db import models
from .user import User

class FriendRequest(models.Model):
	id = models.AutoField(primary_key=True)
	user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_friend_requests')
	user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_friend_requests')
	was_accepted = models.BooleanField(default=False)
	was_canceled = models.BooleanField(default=False)
	was_refused = models.BooleanField(default=False)

	def __str__(self):
		return f"FriendRequest from {self.user1} to {self.user2}"
