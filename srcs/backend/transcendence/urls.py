from django.urls import path
from .views_user import UserCreate, UserList, UserDetail, UserUpdate, UserDelete
from .views_friendrequest import FriendCreate, FriendCancel, FriendAccept, FriendRefuse, FriendDetail, UserFriendRequests

urlpatterns = [
    path('create_user/', UserCreate.as_view(), name='create_user'),
	path('users/', UserList.as_view(), name='users'),
	path('users/<int:pk>/', UserDetail.as_view(), name='user_detail'),
	path('users/<int:pk>/update/', UserUpdate.as_view(), name='user_update'),
	path('users/<int:pk>/delete/', UserDelete.as_view(), name='user_delete'),

	path('friend_requests', FriendCreate.as_view(), name='Friend_Create'),
    path('friend_requests/<int:friendRequestId>/cancel', FriendCancel.as_view(), name='friend_cancel'),
    path('friend_requests/<int:friendRequestId>/accept', FriendAccept.as_view(), name='friend_accept'),
    path('friend_requests/<int:friendRequestId>/refuse', FriendRefuse.as_view(), name='friend_refuse'),
    path('friend_requests/<int:friendRequestId>', FriendDetail.as_view(), name='friend_detail'),
    path('users/<int:userId>/friend_requests', UserFriendRequests.as_view(), name='user_friend_requests'),
]