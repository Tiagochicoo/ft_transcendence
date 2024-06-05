from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
from datetime import timedelta
from django.db.models import Q
from django.utils import timezone
import random
from ...models import ChatRoom as ChatRoom
from ...models import FriendRequest as FriendRequest
from ...models import Match as Match
from ...models import Tournament as Tournament
from ...models import TournamentUser as TournamentUser
from ...models import User as User
# manage.py seed
class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        # Delete Everything
        User.objects.all().delete()
        FriendRequest.objects.all().delete()
        ChatRoom.objects.all().delete()
        Match.objects.all().delete()
        TournamentUser.objects.all().delete()
        Tournament.objects.all().delete()

        # Create Users
        for i in range(20):
            name = f'user{i}'
            User.objects.create(username=name, email=f'{name}@gmail.com', password=make_password(f'pass-{name}'))

        all_users = User.objects.all().order_by('id')

        # Create Friend Requests for the First User
        for user in all_users[1:10]:
            chat_room = ChatRoom.objects.create(user1=all_users[0], user2=user)
            FriendRequest.objects.create(user1=all_users[0], user2=user, chat_room=chat_room, was_accepted=True)

        for user in all_users[10:15]:
            chat_room = ChatRoom.objects.create(user1=all_users[0], user2=user)
            FriendRequest.objects.create(user1=all_users[0], user2=user, chat_room=chat_room)

        for user in all_users[15:20]:
            chat_room = ChatRoom.objects.create(user1=user, user2=all_users[0])
            FriendRequest.objects.create(user1=user, user2=all_users[0], chat_room=chat_room)

        today = timezone.now()
        date = today - timedelta(days=10)

        # Create Matches for the First User
        for user in all_users[1:10]:
            Match.objects.create(created_on=date, user1=all_users[0], user2=user, was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=all_users[0])
            Match.objects.create(created_on=date, user1=all_users[0], user2=user, was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=all_users[0])
            Match.objects.create(created_on=date, user1=all_users[0], user2=user, was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=user)
            date += timedelta(days=1)

        # Create Tournaments for the First User
        date = today - timedelta(days=5)
        for i in range(2):
            tournament = Tournament.objects.create(created_on=date, creator=all_users[0], winner=all_users[0], has_started=True, has_finished=True)
            for i in range(8):
                TournamentUser.objects.create(tournament=tournament, user=all_users[i], was_accepted=True, position=i)
            for i in range(4):
                Match.objects.create(created_on=date, tournament=tournament, user1=all_users[i * 2], user2=all_users[(i * 2) + 1], was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=all_users[i * 2])
            Match.objects.create(created_on=date, tournament=tournament, user1=all_users[0], user2=all_users[2], was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=all_users[0])
            Match.objects.create(created_on=date, tournament=tournament, user1=all_users[4], user2=all_users[6], was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=all_users[4])
            Match.objects.create(created_on=date, tournament=tournament, user1=all_users[0], user2=all_users[4], was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=all_users[0])
            date = today

        # Update the Users metrics
        for user in User.objects.all():
            user_matches = Match.objects.filter(Q(user1=user) | Q(user2=user))
            user.num_games = user_matches.count()
            user.num_games_won = user_matches.filter(winner_id=user.id).count()
            user.num_tournaments = user.tournament_users.count()
            user.num_tournaments_won = 0
            for tournament_user in user.tournament_users.all():
                if (tournament_user.tournament.winner.id == user.id):
                    user.num_tournaments_won += 1
            user.save()

        # Log messages
        self.stdout.write(self.style.SUCCESS(f"Users created: {User.objects.count()}"))
        for user in all_users:
            self.stdout.write(self.style.SUCCESS(f"User: {user}"))

        self.stdout.write(self.style.SUCCESS(f"\nFriend Requests created: {FriendRequest.objects.count()}"))
        for friendRequest in FriendRequest.objects.all():
            self.stdout.write(self.style.SUCCESS(f"Friend Request: {friendRequest}"))

        self.stdout.write(self.style.SUCCESS(f"\nChat Rooms created: {ChatRoom.objects.count()}"))
        for chatRoom in ChatRoom.objects.all():
            self.stdout.write(self.style.SUCCESS(f"Chat Room: {chatRoom}"))

        self.stdout.write(self.style.SUCCESS(f"\nMatches created: {Match.objects.count()}"))
        for match in Match.objects.all():
            self.stdout.write(self.style.SUCCESS(f"Match: {match}"))

        self.stdout.write(self.style.SUCCESS(f"\nTournaments created: {Tournament.objects.count()}"))
        for tournament in Tournament.objects.all():
            self.stdout.write(self.style.SUCCESS(f"Tournament: {tournament}"))

        self.stdout.write(self.style.SUCCESS(f"\nTournament Users created: {TournamentUser.objects.count()}"))
        for tournamentUser in TournamentUser.objects.all():
            self.stdout.write(self.style.SUCCESS(f"TournamentUser: {tournamentUser}"))
