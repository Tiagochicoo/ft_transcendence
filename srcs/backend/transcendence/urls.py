from django.urls import path
from .views.user import UserCreate, UserList, UserDetail, UserUpdate, UserDelete
from .views.friendrequest import FriendCreate, FriendCancel, FriendAccept, FriendRefuse, FriendDetails, UserFriendDetails
from django.http import JsonResponse

urlpatterns = [
    path('create_user/', UserCreate.as_view(), name='create_user'),
    path('users/', UserList.as_view(), name='users'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user_detail'),
    path('users/<int:pk>/update/', UserUpdate.as_view(), name='user_update'),
    path('users/<int:pk>/delete/', UserDelete.as_view(), name='user_delete'),

    path('friend_requests', FriendCreate.as_view(), name='friend_create'),
    path('friend_requests/<int:friendRequestId>/cancel', FriendCancel.as_view(), name='friend_cancel'),
    path('friend_requests/<int:friendRequestId>/accept', FriendAccept.as_view(), name='friend_accept'),
    path('friend_requests/<int:friendRequestId>/refuse', FriendRefuse.as_view(), name='friend_refuse'),
    path('friend_requests/<int:friendRequestId>', FriendDetails.as_view(), name='friend_details'),
    path('users/<int:userId>/friend_requests', UserFriendDetails.as_view(), name='user_friend_details'),
]
