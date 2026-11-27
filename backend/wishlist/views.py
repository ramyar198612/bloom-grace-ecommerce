
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        ).select_related('product')

    def perform_create(self, serializer):
        product = serializer.validated_data['product']

        if not product.is_active:
            raise ValidationError('This product is unavailable.')

        serializer.save(user=self.request.user)


class WishlistDeleteAPIView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )
