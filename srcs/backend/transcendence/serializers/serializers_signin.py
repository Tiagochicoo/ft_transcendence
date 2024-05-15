from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from ..models import User
import logging
from django.contrib.auth.hashers import check_password

logger = logging.getLogger(__name__)

class SignInSerializer(serializers.Serializer):
    username_email = serializers.CharField(required=True, error_messages={
        'blank': 'field_blank'
    })
    password = serializers.CharField(required=True, error_messages={
        'blank': 'password_blank'
    })

    def validate_username_email(self, value):
        if not value:
            raise serializers.ValidationError("field_blank", code='blank')
        
        if '@' in value:
            try:
                validate_email(value)
                user_exists = User.objects.filter(email=value).exists()
            except ValidationError:
                raise serializers.ValidationError("invalid_email_address", code='invalid')
        else:
            user_exists = User.objects.filter(username=value).exists()
        
        if not user_exists:
            raise serializers.ValidationError("account_not_found", code='not_found')

        return value
    

    def validate(self, data):
        user = self.custom_authenticate(data['username_email'], data['password'])
        if not user:
            raise serializers.ValidationError("invalid_credentials", code='invalid_credentials')
        data['user'] = user
        return data
    
    @staticmethod
    def custom_authenticate(username_or_email, password):
        
        user = User.objects.filter(username=username_or_email).first() or \
               User.objects.filter(email=username_or_email).first()

        if user:
            if check_password(password, user.password):
                logger.info(f"Login successful for {username_or_email}")
                return user
            else:
                logger.warning(f"Failed login attempt for {username_or_email}: Incorrect password")
                raise serializers.ValidationError("incorrect_password", code='invalid_credentials')
        else:
            logger.warning(f"Failed login attempt for {username_or_email}: User not found")
            raise serializers.ValidationError("account_not_found", code='invalid_credentials')