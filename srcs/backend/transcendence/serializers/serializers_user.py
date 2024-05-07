from rest_framework import serializers
from ..models import User
from django.contrib.auth.hashers import make_password
from django.core.validators import EmailValidator, MaxLengthValidator

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'username', 'num_games', 'num_games_won', 'num_tournaments', 'num_tournaments_won']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        # Validate email format
        validator = EmailValidator(message="Invalid email format.")
        validator(value)

        # Validate email length
        max_length_validator = MaxLengthValidator(254, message="Email is too long.")
        max_length_validator(value)

        # Check for uniqueness
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        # Validate username length
        if len(value) < 5:
            raise serializers.ValidationError("Username must be at least 5 characters.")
        elif len(value) > 150:
            raise serializers.ValidationError("Username is too long.")

        # Check for uniqueness
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value

    def validate_password(self, value):
        # Add password complexity validation if necessary
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            num_games=validated_data.get('num_games', 0),
            num_games_won=validated_data.get('num_games_won', 0),
            num_tournaments=validated_data.get('num_tournaments', 0),
            num_tournaments_won=validated_data.get('num_tournaments_won', 0)
        )
        user.save()
        return user
