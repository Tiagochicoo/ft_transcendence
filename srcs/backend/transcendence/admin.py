from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'num_games', 'num_games_won')  # Specify the columns to display

admin.site.register(User, UserAdmin)
