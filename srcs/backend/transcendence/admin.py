from django.contrib import admin

# Register your models here.
from .models import User # Adjust the import according to your model

admin.site.register(User)
