from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
import random
from ...models import ChatRoom as ChatRoom
from ...models import FriendRequest as FriendRequest
from ...models import Match as Match
from ...models import User as User

# manage.py seed
class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        # Delete Everything
        User.objects.all().delete()
        FriendRequest.objects.all().delete()
        ChatRoom.objects.all().delete()
        Match.objects.all().delete()

        # Create Users
        for i in range(20):
            name = f'user{i}'
            User.objects.create(username=name, email=f'{name}@gmail.com', password=make_password(f'pass-{name}'))

        all_users = User.objects.all()

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

        # Create Matches for the First User
        for user in all_users[1:10]:
            Match.objects.create(user1=all_users[0], user2=user, was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=all_users[0])
            Match.objects.create(user1=all_users[0], user2=user, was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=all_users[0])
            Match.objects.create(user1=all_users[0], user2=user, was_accepted=True, has_finished=True, score=random.randint(1, 5), winner=user)

        # Log messages
        for user in all_users:
            self.stdout.write(self.style.SUCCESS(f"User: {user}"))

        self.stdout.write(self.style.SUCCESS("\n"))
        for friendRequest in FriendRequest.objects.all():
            self.stdout.write(self.style.SUCCESS(f"Friend Request: {friendRequest}"))

        self.stdout.write(self.style.SUCCESS("\n"))
        for chatRoom in ChatRoom.objects.all():
            self.stdout.write(self.style.SUCCESS(f"Chat Room: {chatRoom}"))
