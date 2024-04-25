from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'username', 'num_games', 'num_games_won', 'num_tournaments', 'num_tournaments_won']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
            num_games=validated_data['num_games'],
            num_games_won=validated_data['num_games_won'],
            num_tournaments=validated_data['num_tournaments'],
            num_tournaments_won=validated_data['num_tournaments_won'],
        )
        
        user.password = make_password(validated_data['password'])
        user.save()
        return user
