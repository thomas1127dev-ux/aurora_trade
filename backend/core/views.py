from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import User, EmailVerification
from .serializers import RegisterSerializer, LoginSerializer
from django.core.mail import send_mail
import secrets, datetime
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(["POST"])
@permission_classes([AllowAny])
def send_email_code(request):
    email = request.data.get("email")
    purpose = request.data.get("purpose", "register")
    if not email:
        return Response({"detail": "email required"}, status=400)
    # rate limit: check last 5 minutes
    recent = EmailVerification.objects.filter(email=email, purpose=purpose).order_by("-created").first()
    if recent and (timezone.now() - recent.created).total_seconds() < 300:
        return Response({"detail": "请稍后再请求验证码（5 分钟限制）"}, status=429)
    code = ''.join(secrets.choice("0123456789") for _ in range(6))
    ev = EmailVerification.objects.create(email=email, code=code, purpose=purpose)
    # send email (console/email backend)
    send_mail(f"[Aurora] 验证码 {code}", f"你的验证码：{code}（10分钟有效）", None, [email])
    return Response({"detail": "验证码已发送（开发环境为控制台输出）"})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    ser = RegisterSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    email = ser.validated_data["email"]
    code = ser.validated_data["code"]
    # validate code within 10 minutes
    ev = EmailVerification.objects.filter(email=email, purpose="register", code=code).order_by("-created").first()
    if not ev:
        return Response({"detail": "验证码无效"}, status=400)
    if (timezone.now() - ev.created).total_seconds() > 600:
        return Response({"detail": "验证码已过期"}, status=400)
    username = ser.validated_data["username"]
    password = ser.validated_data["password"]
    if User.objects.filter(username=username).exists():
        return Response({"detail": "用户名已存在"}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({"detail": "邮箱已存在"}, status=400)
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"detail": "注册成功，请登录"})


@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    ser = LoginSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    login = ser.validated_data["login"]
    password = ser.validated_data["password"]
    # allow username or email
    try:
        user = User.objects.get(username=login)
    except User.DoesNotExist:
        try:
            user = User.objects.get(email=login)
        except User.DoesNotExist:
            return Response({"detail": "用户不存在"}, status=400)
    if not user.check_password(password):
        return Response({"detail": "密码错误"}, status=400)
    # single session: generate jwt and (client responsibility) use it.
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    user.last_login_time = timezone.now()
    user.save()
    return Response({"access": access, "refresh": str(refresh), "invite_code": user.invite_code})


@api_view(["GET"])
@permission_classes([AllowAny])
def announcement_list_public(request):
    # simple static sample announcements for demo
    anns = [
        {"id": 1, "title": "系统维护通知", "content": "将于周末进行短暂维护，请注意备份。"},
        {"id": 2, "title": "新功能上线", "content": "支持VIP码兑换功能，敬请体验。"},
    ]
    return Response({"announcements": anns})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """
    返回当前用户信息（包含 is_staff 字段以便前端识别管理员）
    """
    u = request.user
    data = {
        "username": u.username,
        "email": u.email,
        "invite_code": u.invite_code,
        "coin_balance": u.coin_balance,
        "is_staff": bool(u.is_staff),
        "status": u.status,
        "register_time": u.register_time,
        # 你可按需加入更多字段，例如 last_login_time
        "last_login_time": u.last_login_time,
    }
    return Response(data)
