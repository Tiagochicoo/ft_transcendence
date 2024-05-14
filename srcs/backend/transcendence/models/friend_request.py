from django.db import models
from .chat_room import ChatRoom
from .user import User

class FriendRequest(models.Model):
	user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_friend_requests')
	user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_friend_requests')
	was_accepted = models.BooleanField(default=False)
	was_canceled = models.BooleanField(default=False)
	was_refused = models.BooleanField(default=False)
	chat_room = models.ForeignKey(ChatRoom, on_delete=models.SET_NULL, null=True, related_name='chat_room')

	def __str__(self):
		return f"FriendRequest from {self.user1} to {self.user2}"
