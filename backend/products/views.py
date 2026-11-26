
from rest_framework import generics, filters
from .models import Product
from .serializers import ProductSerializer


class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)

        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')

        if category:
            queryset = queryset.filter(category__slug=category)

        if featured == 'true':
            queryset = queryset.filter(is_featured=True)

        return queryset


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'pk'