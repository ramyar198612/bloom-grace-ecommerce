
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer


class OrderCreateAPIView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [AllowAny]


class OrderDetailAPIView(generics.RetrieveAPIView):
    queryset = Order.objects.prefetch_related('items').all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]
    lookup_field = 'order_number'
