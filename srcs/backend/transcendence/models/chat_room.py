from django.db import models
from .user import User

class ChatRoom(models.Model):
	user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms_as_user1')
	user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms_as_user2')
	was_blocked = models.BooleanField(default=False)
	block_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='chat_rooms_blocked')

	def __str__(self):
		return f"ChatRoom of {self.user1} with {self.user2}"
