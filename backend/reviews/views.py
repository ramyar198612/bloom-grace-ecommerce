
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from .models import ProductReview
from .serializers import ProductReviewSerializer


class ProductReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ProductReviewSerializer

    def get_queryset(self):
        return ProductReview.objects.filter(
            product_id=self.kwargs['product_id']
        ).select_related('user', 'product')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']

        if ProductReview.objects.filter(
            user=self.request.user,
            product_id=product_id
        ).exists():
            raise ValidationError(
                'You have already reviewed this product.'
            )

        serializer.save(
            user=self.request.user,
            product_id=product_id
        )


class ProductReviewDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProductReview.objects.filter(
            user=self.request.user
        ).select_related('user', 'product')
