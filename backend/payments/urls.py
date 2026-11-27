
from django.urls import path
from .views import (
    CreatePaymentOrderAPIView,
    VerifyPaymentAPIView,
)

urlpatterns = [
    path(
        'create-order/',
        CreatePaymentOrderAPIView.as_view(),
        name='create-payment-order'
    ),
    path(
        'verify/',
        VerifyPaymentAPIView.as_view(),
        name='verify-payment'
    ),
]
