from django.urls import path
from . import views
from django.urls import path
from .views import UserCreate, UserList

urlpatterns = [
    path('create_user/', UserCreate.as_view(), name='create_user'),
	path('users/', views.UserList.as_view(), name='users'),
]