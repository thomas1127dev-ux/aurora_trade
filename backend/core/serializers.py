from rest_framework import serializers
from .models import User, EmailVerification
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=6, max_length=20)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, max_length=128, write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    code = serializers.CharField()
    invite_code = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        # password strength simple check
        p = data["password"]
        if not any(c.islower() for c in p) or not any(c.isupper() for c in p) or not any(c.isdigit() for c in p):
            raise serializers.ValidationError("Password strength insufficient (need upper/lower/digit)")
        return data


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()
