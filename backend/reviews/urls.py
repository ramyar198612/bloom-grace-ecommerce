
from django.urls import path

from .views import (
    ProductReviewListCreateAPIView,
    ProductReviewDetailAPIView,
)

urlpatterns = [
    path(
        'products/<int:product_id>/',
        ProductReviewListCreateAPIView.as_view(),
        name='product-review-list-create'
    ),
    path(
        '<int:pk>/',
        ProductReviewDetailAPIView.as_view(),
        name='product-review-detail'
    ),
]
