from django.urls import path
from .views.chatroom import ChatRoomCreate, ChatRoomBlock, ChatRoomUnblock, ChatRoomMessages, ChatRoomDetails, UserChatRoomDetails
from .views.friendrequest import FriendCreate, FriendCancel, FriendAccept, FriendRefuse, FriendDetails, UserFriendDetails
from .views.match import MatchCreate, MatchDetail, MatchUpdate, MatchCancel, MatchAccept, MatchRefuse, MatchFinish, MatchByTournament, UserMatchDetails
from .views.tournament import TournamentCreate, TournamentMatches, TournamentFinish, TournamentTournamentUserDetails, UserTournamentUserDetails, TournamentUserAccept, TournamentUserRefuse, TournamentDetail, TournamentUpdate
from .views.tournament_user import TournamentUserCreate, TournamentUserDetail
from .views.user import UserList, UserDetails, UserDashboard, UserLogin, WhoAmI
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('users', UserList.as_view(), name='users'),
    # Added a forward slash (/) to the end of the URL because it was breaking with query params
    path('users/', UserList.as_view(), name='users'),
    path('users/<int:userId>', UserDetails.as_view(), name='user_details'),
    path('users/<int:userId>/dashboard', UserDashboard.as_view(), name='user_details'),
    path('sign-in', UserLogin.as_view(), name='user_login'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify', TokenVerifyView.as_view(), name='token_verify'),
    path('whoami/', WhoAmI.as_view(), name='whoami'),

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
	
    path('matches/', MatchCreate.as_view(), name='create_match'),
    path('matches/<int:id>/', MatchDetail.as_view(), name='match_detail'),
    path('matches/update', MatchUpdate.as_view(), name='match_update'),
    path('matches/<int:MatchId>/cancel/', MatchCancel.as_view(), name='match_cancel'),
    path('matches/<int:MatchId>/accept/', MatchAccept.as_view(), name='match_accept'),
    path('matches/<int:MatchId>/refuse/', MatchRefuse.as_view(), name='match_refuse'),
    path('matches/<int:MatchId>/finish/', MatchFinish.as_view(), name='match_finish'),
    path('matches/on-tournament/<int:tournament_id>/', MatchByTournament.as_view(), name='match_by_tournament'),
    path('users/<int:userId>/matches/', UserMatchDetails.as_view(), name='user_match_details'),
	
    path('tournaments/', TournamentCreate.as_view(), name='tournament_create'),
    path('tournaments/<int:tournamentId>/matches/', TournamentMatches.as_view(), name='tournament_matches_create'),
    path('tournaments/<int:tournamentId>/finish/', TournamentFinish.as_view(), name='tournament_finish'),
    path('tournaments/<int:tournamentId>/tournament_users/', TournamentTournamentUserDetails.as_view(), name='tournament_tournament_user_create'),
    path('users/<int:userId>/tournament_users/', UserTournamentUserDetails.as_view(), name='user_tournament_user_details'),
    path('tournament_users/<int:tournamentUserId>/accept/', TournamentUserAccept.as_view(), name='tournament_user_accept'),
    path('tournament_users/<int:tournamentUserId>/refuse/', TournamentUserRefuse.as_view(), name='tournament_user_refuse'),
	path('tournament/update', TournamentUpdate.as_view(), name='tournament_update'),
	path('tournament/<int:id>/', TournamentDetail.as_view(), name='tournament_detail'),
    path('tournament_user/', TournamentUserCreate.as_view(), name='create_tournament_user'),
	path('tournament_user/<int:tournament_id>/', TournamentUserDetail.as_view(), name='tournament_user_detail'),
]
