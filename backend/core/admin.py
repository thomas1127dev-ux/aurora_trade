from django.contrib import admin
from .models import User, EmailVerification


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "invite_code", "status", "register_time", "is_staff")


@admin.register(EmailVerification)
class EVAdmin(admin.ModelAdmin):
    list_display = ("email", "code", "purpose", "created")
