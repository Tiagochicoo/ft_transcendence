from django.urls import path
from . import views
from django.urls import path
from .views import UserCreate

urlpatterns = [
    path('create_user/', UserCreate.as_view(), name='create_user'),
]