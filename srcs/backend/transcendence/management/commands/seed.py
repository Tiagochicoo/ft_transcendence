from django.core.management.base import BaseCommand
from ...models import User as User
from ...models import FriendRequest as FriendRequest

# manage.py seed
class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        # Delete Everything
        User.objects.all().delete()
        FriendRequest.objects.all().delete()

        # Create Users
        for i in range(20):
            name = f'user{i}'
            User.objects.create(username=name, email=f'{name}@gmail.com', password=f'pass-{name}')

        all_users = User.objects.all()

        # Create Friend Requests for the First User
        for user in all_users[1:10]:
            FriendRequest.objects.create(user1=all_users[0], user2=user, was_accepted=True)

        for user in all_users[10:15]:
            FriendRequest.objects.create(user1=all_users[0], user2=user)

        for user in all_users[15:20]:
            FriendRequest.objects.create(user1=user, user2=all_users[0])

        # Log messages
        for user in all_users:
            self.stdout.write(self.style.SUCCESS(f'Username: {user.username}, Email: {user.email}, Password: {user.password}'))

        all_fr = FriendRequest.objects.all()
        for friendRequest in all_fr:
            self.stdout.write(self.style.SUCCESS(f"Friend Request from {friendRequest.user1} to {friendRequest.user2}"))
