from django.urls import path
from . import views

urlpatterns = [
    path("user/send-code/", views.send_email_code),
    path("user/register", views.register),
    path("user/login", views.login_view),
    path("user/announcement/list", views.announcement_list_public),
    path("user/me", views.me),
]
