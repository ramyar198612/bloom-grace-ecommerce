
from rest_framework import serializers
from products.models import Product
from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    product_details = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = [
            'id',
            'product',
            'product_details',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_product_details(self, obj):
        product = obj.product

        return {
            'id': product.id,
            'name': product.name,
            'slug': product.slug,
            'price': str(product.price),
            'original_price': (
                str(product.original_price)
                if product.original_price is not None else None
            ),
            'image': product.image.url if product.image else None,
            'stock': product.stock,
            'is_active': product.is_active,
        }

    def validate_product(self, value):
        if not value.is_active:
            raise serializers.ValidationError(
                'This product is currently unavailable.'
            )
        return value

    def create(self, validated_data):
        wishlist, created = Wishlist.objects.get_or_create(
            user=self.context['request'].user,
            product=validated_data['product']
        )
        return wishlist
