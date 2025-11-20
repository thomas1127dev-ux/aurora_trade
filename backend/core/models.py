from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import secrets, string


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra):
        if not email:
            raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra)
        user.set_password(password)
        user.invite_code = User.generate_invite_code()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self.create_user(username, email, password, **extra)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    invite_code = models.CharField(max_length=8, unique=True, blank=True)
    register_time = models.DateTimeField(auto_now_add=True)
    last_login_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default="normal")
    coin_balance = models.IntegerField(default=0)
    is_staff = models.BooleanField(default=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    objects = UserManager()

    def __str__(self): return self.email

    @staticmethod
    def generate_invite_code():
        # 8 digit numeric unique-like code
        return ''.join(secrets.choice('0123456789') for _ in range(8))


class EmailVerification(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=8)
    created = models.DateTimeField(auto_now_add=True)
    purpose = models.CharField(max_length=32, default="register")

    class Meta:
        indexes = [models.Index(fields=["email", "purpose"])]
