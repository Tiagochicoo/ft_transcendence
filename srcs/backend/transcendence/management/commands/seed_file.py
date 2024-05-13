from django.core.management.base import BaseCommand
from ...models import User as User
from ...models import FriendRequest as FriendRequest

# docker exec django python3 manage.py seed_file

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        ricardo, _ = User.objects.get_or_create(username='ricardo', email='ricardo@gmail.com', defaults={'password': 'ricardo1abc'})
        rita, _ = User.objects.get_or_create(username='rita', email='rita@gmail.com', defaults={'password': 'nao192'})
        thatguy, _ = User.objects.get_or_create(username='thatguy', email='thatguy@gmail.com', defaults={'password': 'vpvp192'})        
        FriendRequest.objects.get_or_create(user1=ricardo, user2=rita)
        FriendRequest.objects.get_or_create(user1=thatguy, user2=rita)

        user_var = User.objects.all()
        for user in user_var:
            self.stdout.write(self.style.SUCCESS(f'Username: {user.username}, Email: {user.email}, Password: {user.password}'))

        fr_var = FriendRequest.objects.all()
        for friendRequest in fr_var:
            self.stdout.write(self.style.SUCCESS(f"Friend Request from {friendRequest.user1} to {friendRequest.user2}"))
