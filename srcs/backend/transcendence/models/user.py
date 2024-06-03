from django.db import models
import pyotp

class User(models.Model):
	id = models.AutoField(primary_key=True)
	email = models.EmailField(unique=True)
	password = models.CharField(max_length=128)
	username = models.CharField(max_length=12, unique=True)
	avatar = models.ImageField(upload_to='avatars/', default='avatars/default.jpeg')
	num_games = models.IntegerField(default=0)
	num_games_won = models.IntegerField(default=0)
	num_tournaments = models.IntegerField(default=0)
	num_tournaments_won = models.IntegerField(default=0)
	is_active = models.BooleanField(default=True)
	is_authenticated = models.BooleanField(default=True)
	preferred_language = models.CharField(max_length=2, default='en')
	is_2fa_enabled = models.BooleanField(default=False)
	two_factor_code = models.CharField(max_length=32, blank=True, null=True)

	def __str__(self):
		return f"{self.username} ({self.email})"
	
	def verify_2fa_code(self, code):
		if not self.two_factor_code:
			return False
		totp = pyotp.TOTP(self.two_factor_code)
		return totp.verify(code)
