from django.urls import path
from .views.user import UserCreate, UserList, UserDetail, UserUpdate, UserDelete
from .views.friendrequest import FriendCreate, FriendCancel, FriendAccept, FriendRefuse, FriendDetails, UserFriendDetails
from .views.chatRoom import ChatRoomCreate, ChatRoomCancel, ChatRoomAccept, ChatRoomRefuse, ChatRoomBlock, ChatRoomUnblock, ChatRoomMessages, ChatRoomDetails, UserChatRoomDetails,

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

    path('chat_rooms', ChatRoomCreate.as_view(), name='chat_room_create'),
    path('chat_rooms/<int:chatRoomId>/cancel', ChatRoomCancel.as_view(), name='chat_room_cancel'),
    path('chat_rooms/<int:chatRoomId>/accept', ChatRoomAccept.as_view(), name='chat_room_accept'),
    path('chat_rooms/<int:chatRoomId>/refuse', ChatRoomRefuse.as_view(), name='chat_room_refuse'),
    path('chat_rooms/<int:chatRoomId>/block', ChatRoomBlock.as_view(), name='chat_room_block'),
    path('chat_rooms/<int:chatRoomId>/unblock', ChatRoomUnblock.as_view(), name='chat_room_unblock'),
    path('chat_rooms/<int:chatRoomId>/messages', ChatRoomMessages.as_view(), name='chat_room_messages'),
    path('chat_rooms/<int:chatRoomId>', ChatRoomDetails.as_view(), name='chat_room_details'),
    path('users/<int:userId>/chat_rooms', UserChatRoomDetails.as_view(), name='user_chat_room_details'),
]
