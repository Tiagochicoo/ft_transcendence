from django.db import models
from .chat_room import ChatRoom
from .user import User

class Message(models.Model):
	chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
	sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='messages')
	content = models.TextField(max_length=1000)

	def __str__(self):
		return f"Message sent by {self.sender}"
