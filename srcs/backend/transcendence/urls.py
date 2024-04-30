from django.urls import path
from . import views
from django.urls import path
from .views import UserCreate, UserList
#
urlpatterns = [
    path('create_user/', UserCreate.as_view(), name='create_user'),
	path('users/', views.UserList.as_view(), name='users'),
	path('users/<int:pk>/', views.UserDetail.as_view(), name='user_detail'),
	path('users/<int:pk>/update/', views.UserUpdate.as_view(), name='user_update'),
	path('users/<int:pk>/delete/', views.UserDelete.as_view(), name='user_delete'),
]
