
from django.urls import path

from .views import (
    CustomerRegistrationView,
    CustomerLoginView,
    CustomerProfileView,
    CustomerLogoutView,
    VerifyEmailOTPView,
    ResendEmailOTPView,
)


urlpatterns = [
    path(
        'register/',
        CustomerRegistrationView.as_view(),
        name='customer-register',
    ),
    path(
        'verify-email/',
        VerifyEmailOTPView.as_view(),
        name='verify-email',
    ),
    path(
        'resend-otp/',
        ResendEmailOTPView.as_view(),
        name='resend-otp',
    ),
    path(
        'login/',
        CustomerLoginView.as_view(),
        name='customer-login',
    ),
    path(
        'profile/',
        CustomerProfileView.as_view(),
        name='customer-profile',
    ),
    path(
        'logout/',
        CustomerLogoutView.as_view(),
        name='customer-logout',
    ),
]
