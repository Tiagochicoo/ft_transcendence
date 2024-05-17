from django.urls import path
from .views.user import UserCreate, UserList, UserDetail, UserUpdate, UserDelete, UserLogin
from .views.chatroom import ChatRoomCreate, ChatRoomBlock, ChatRoomUnblock, ChatRoomMessages, ChatRoomDetails, UserChatRoomDetails
from .views.friendrequest import FriendCreate, FriendCancel, FriendAccept, FriendRefuse, FriendDetails, UserFriendDetails
from .views.matches import MatchCreate, MatchCancel, MatchAccept, MatchRefuse, MatchFinish, MatchDetails, UserMatchDetails
from .views.tournaments import TournamentCreate, TournamentStart, TournamentFinish, TournamentDetails, UserTournamentDetails
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('create_user/', UserCreate.as_view(), name='create_user'),
    path('users/', UserList.as_view(), name='users'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user_detail'),
    path('users/<int:pk>/update/', UserUpdate.as_view(), name='user_update'),
    path('users/<int:pk>/delete/', UserDelete.as_view(), name='user_delete'),
    path('sign-in/', UserLogin.as_view(), name='user_login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

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

    path('matches', MatchCreate.as_view(), name='match_create'),
    path('matches/<int:matchId>/cancel', MatchCancel.as_view(), name='match_cancel'),
    path('matches/<int:matchId>/accept', MatchAccept.as_view(), name='match_accept'),
    path('matches/<int:matchId>/refuse', MatchRefuse.as_view(), name='match_refuse'),
    path('matches/<int:matchId>/finish', MatchFinish.as_view(), name='match_finish'),
    path('matches/<int:matchId>', MatchDetails.as_view(), name='match_details'),
    path('users/<int:userId>/matches', UserMatchDetails.as_view(), name='user_match_details'),

    path('tournaments', TournamentCreate.as_view(), name='tournament_create'),
    path('tournaments/:tournamentId/start', TournamentStart.as_view(), name='tournament_start'),
    path('tournaments/:tournamentId/finish', TournamentFinish.as_view(), name='tournament_finish'),
    path('tournaments/:tournamentId', TournamentDetails.as_view(), name='tournament_detail'),
    path('users/:userId/tournaments', UserTournamentDetails.as_view(), name='user_tournament_detail'),
]
