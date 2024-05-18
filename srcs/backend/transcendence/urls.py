from django.urls import path
from .views.chatroom import ChatRoomCreate, ChatRoomBlock, ChatRoomUnblock, ChatRoomMessages, ChatRoomDetails, UserChatRoomDetails
from .views.friendrequest import FriendCreate, FriendCancel, FriendAccept, FriendRefuse, FriendDetails, UserFriendDetails
from .views.user import UserList, UserDetails, UserLogin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('users', UserList.as_view(), name='users'),
    path('users/<int:userId>', UserDetails.as_view(), name='user_details'),
    path('sign-in', UserLogin.as_view(), name='user_login'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify', TokenVerifyView.as_view(), name='token_verify'),

    path('friend_requests', FriendCreate.as_view(), name='friend_create'),
    path('friend_requests/<int:friendRequestId>/cancel', FriendCancel.as_view(), name='friend_cancel'),
    path('friend_requests/<int:friendRequestId>/accept', FriendAccept.as_view(), name='friend_accept'),
    path('friend_requests/<int:friendRequestId>/refuse', FriendRefuse.as_view(), name='friend_refuse'),
    path('friend_requests/<int:friendRequestId>', FriendDetails.as_view(), name='friend_details'),
    path('users/<int:userId>/friend_requests', UserFriendDetails.as_view(), name='user_friend_details'),

    path('chat_rooms', ChatRoomCreate.as_view(), name='chat_room_create'),
    path('chat_rooms/<int:chatRoomId>/block', ChatRoomBlock.as_view(), name='chat_room_block'),
    path('chat_rooms/<int:chatRoomId>/unblock', ChatRoomUnblock.as_view(), name='chat_room_unblock'),
    path('chat_rooms/<int:chatRoomId>/messages', ChatRoomMessages.as_view(), name='chat_room_messages'),
    path('chat_rooms/<int:chatRoomId>', ChatRoomDetails.as_view(), name='chat_room_details'),
    path('users/<int:userId>/chat_rooms', UserChatRoomDetails.as_view(), name='user_chat_room_details'),
]
