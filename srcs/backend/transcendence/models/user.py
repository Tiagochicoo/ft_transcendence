from django.db import models

class User(models.Model):
	id = models.AutoField(primary_key=True)
	email = models.EmailField(unique=True, error_messages={
		"unique":"This email is already in use."
	})
	password = models.CharField(max_length=128)
	username = models.CharField(max_length=50, unique=True, error_messages={
		"unique":"This username is already in use."
		})
	# avatar = models.ImageField(upload_to='avatars/')
	num_games = models.IntegerField(default=0)
	num_games_won = models.IntegerField(default=0)
	num_tournaments = models.IntegerField(default=0)
	num_tournaments_won = models.IntegerField(default=0)

	def __str__(self):
		return f"{self.username} ({self.email})"
