
from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'sku',
            'category',
            'category_name',
            'description',
            'price',
            'original_price',
            'image',
            'stock',
            'is_featured',
            'is_active',
            'created_at',
        ]
