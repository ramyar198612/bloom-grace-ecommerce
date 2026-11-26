
from django.urls import path
from .views import OrderCreateAPIView, OrderDetailAPIView

urlpatterns = [
    path('', OrderCreateAPIView.as_view(), name='create-order'),
    path('<str:order_number>/', OrderDetailAPIView.as_view(), name='order-detail'),
]
