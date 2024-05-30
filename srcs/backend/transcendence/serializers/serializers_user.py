import os
from django.contrib.auth.hashers import make_password
from django.core.validators import EmailValidator, MaxLengthValidator
from rest_framework import serializers
from ..models import User

class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        error_messages={
            'blank': 'email_cannot_be_blank',
            'invalid': 'email_invalid_format'
        }
    )

    username = serializers.CharField(
        max_length=50,
        error_messages={
            'blank': 'username_cannot_be_blank', 
            'max_length': 'username_too_long'
        }
    )

    password = serializers.CharField(
        max_length=128,
        write_only=True,
        error_messages={
            'blank': 'password_cannot_be_blank',
            'min_length': 'password_too_short'
        },
        min_length=8
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'username', 'avatar', 'num_games', 'num_games_won', 'num_tournaments', 'num_tournaments_won', 'preferred_language']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        # Validate email format
        validator = EmailValidator(message="email_invalid_format")
        validator(value)

        # Validate email length
        max_length_validator = MaxLengthValidator(254, message="email_too_long")
        max_length_validator(value)

        # Check for uniqueness
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("email_in_use")
        return value

    def validate_username(self, value):
        # Validate username length
        if len(value) < 5:
            raise serializers.ValidationError("username_too_short")
        elif len(value) > 150:
            raise serializers.ValidationError("username_too_long")

        # Check for uniqueness
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("username_in_use")
        return value

    def validate_avatar(self, value):
        valid_extensions = ['.png', '.jpg', '.jpeg']
        extension = os.path.splitext(value.name)[1].lower()
        if not extension in valid_extensions:
            raise serializers.ValidationError("avatar_unsupported_file_extension")
        limit_kb = 100
        if value.size > limit_kb * 1024:
            raise serializers.ValidationError("avatar_file_size_exceed_limit")
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("password_too_short")
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
        # Only set the avatar if provided
        # The default value was not working properly otherwise
        if 'avatar' in validated_data:
            user.avatar = validated_data['avatar']
        user.save()
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
