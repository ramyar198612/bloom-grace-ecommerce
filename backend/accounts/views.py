
import secrets
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.contrib.auth import authenticate, get_user_model

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import CustomerRegistrationSerializer
from .models import EmailOTP


User = get_user_model()


def send_email_otp(user):
    otp = str(secrets.randbelow(900000) + 100000)

    EmailOTP.objects.filter(
        user=user,
        is_used=False
    ).update(is_used=True)

    EmailOTP.objects.create(
        user=user,
        otp=otp,
        expires_at=timezone.now() + timedelta(minutes=5)
    )

    sender = f"Bloom & Grace <{settings.DEFAULT_FROM_EMAIL}>"

    send_mail(
        subject="Verify Your Bloom & Grace Account",
        message=(
            f"Hello {user.username},\n\n"
            f"Your email verification OTP is: {otp}\n\n"
            "This OTP expires in 5 minutes.\n"
            "Please do not share this code with anyone.\n\n"
            "Thank you,\nBloom & Grace Team"
        ),
        from_email=sender,
        recipient_list=[user.email],
        fail_silently=False,
    )


def send_welcome_email(user):
    sender = f"Bloom & Grace <{settings.DEFAULT_FROM_EMAIL}>"

    subject = "Welcome to Bloom & Grace!"

    message = (
        f"Dear {user.username},\n\n"
        "Welcome to Bloom & Grace!\n\n"
        "We are delighted to have you as part of our family.\n"
        "Your email address has been successfully verified "
        "and your customer account is now active.\n\n"
        "You can now:\n"
        "- Explore our artificial flower collections.\n"
        "- Discover beautiful bouquets and decorations.\n"
        "- Shop for hair accessories.\n"
        "- Place orders and track your purchases.\n\n"
        "Visit our website:\n"
        "https://bloom-grace-ecommerce.vercel.app\n\n"
        "Thank you for choosing Bloom & Grace.\n"
        "We look forward to serving you!\n\n"
        "Warm regards,\n"
        "Bloom & Grace Team"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=sender,
        recipient_list=[user.email],
        fail_silently=False,
    )


class CustomerRegistrationView(generics.CreateAPIView):
    serializer_class = CustomerRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        try:
            send_email_otp(user)
        except Exception:
            user.delete()

            return Response(
                {
                    'error': (
                        'Registration email could not be sent. '
                        'Please try again.'
                    )
                },
                status=503
            )

        return Response(
            {
                'message': (
                    'Registration successful. '
                    'Please check your email for the verification OTP.'
                ),
                'email': user.email,
                'email_verification_required': True,
            },
            status=201
        )


class VerifyEmailOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        otp = request.data.get('otp', '').strip()

        if not email or not otp:
            return Response(
                {'error': 'Email and OTP are required.'},
                status=400
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid email or OTP.'},
                status=400
            )

        if user.is_email_verified:
            return Response(
                {'message': 'Email is already verified.'},
                status=200
            )

        otp_record = EmailOTP.objects.filter(
            user=user,
            is_used=False
        ).order_by('-created_at').first()

        if not otp_record:
            return Response(
                {
                    'error': (
                        'OTP not found. Please request a new OTP.'
                    )
                },
                status=400
            )

        if otp_record.expires_at <= timezone.now():
            otp_record.is_used = True
            otp_record.save(update_fields=['is_used'])

            return Response(
                {'error': 'OTP expired. Please request a new OTP.'},
                status=400
            )

        if otp_record.attempts >= 5:
            otp_record.is_used = True
            otp_record.save(update_fields=['is_used'])

            return Response(
                {
                    'error': (
                        'Too many attempts. Please request a new OTP.'
                    )
                },
                status=400
            )

        if otp_record.otp != otp:
            otp_record.attempts += 1
            otp_record.save(update_fields=['attempts'])

            return Response(
                {'error': 'Incorrect OTP. Please try again.'},
                status=400
            )

        otp_record.is_used = True
        otp_record.save(update_fields=['is_used'])

        user.is_email_verified = True
        user.save(update_fields=['is_email_verified'])

        welcome_email_sent = True

        try:
            send_welcome_email(user)
        except Exception:
            welcome_email_sent = False

        return Response({
            'message': 'Email verified successfully. You can now log in.',
            'welcome_email_sent': welcome_email_sent,
        })


class ResendEmailOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()

        if not email:
            return Response(
                {'error': 'Email is required.'},
                status=400
            )

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Account not found.'},
                status=404
            )

        if user.is_email_verified:
            return Response(
                {'message': 'Email is already verified.'},
                status=200
            )

        recent_otp = EmailOTP.objects.filter(
            user=user
        ).order_by('-created_at').first()

        if recent_otp and (
            timezone.now() - recent_otp.created_at
        ).total_seconds() < 60:
            return Response(
                {
                    'error': (
                        'Please wait 60 seconds before requesting '
                        'another OTP.'
                    )
                },
                status=429
            )

        try:
            send_email_otp(user)
        except Exception:
            return Response(
                {
                    'error': (
                        'Unable to send OTP email. Please try again.'
                    )
                },
                status=503
            )

        return Response({
            'message': 'A new verification OTP has been sent to your email.'
        })


class CustomerLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=400
            )

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {'error': 'Invalid username or password.'},
                status=401
            )

        if user.role != user.Role.CUSTOMER:
            return Response(
                {'error': 'Customer account required.'},
                status=403
            )

        if not user.is_email_verified:
            return Response(
                {
                    'error': (
                        'Please verify your email before logging in.'
                    ),
                    'email_verification_required': True,
                    'email': user.email,
                },
                status=403
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Login successful.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'phone': user.phone,
                'role': user.role,
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class CustomerProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'role': user.role,
        })

    def put(self, request):
        user = request.user

        user.email = request.data.get('email', user.email)
        user.phone = request.data.get('phone', user.phone)

        user.save()

        return Response({
            'message': 'Profile updated successfully.',
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
        })


class CustomerLogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required.'},
                status=400
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({'message': 'Logout successful.'})

        except Exception:
            return Response(
                {'error': 'Invalid refresh token.'},
                status=400
            )
