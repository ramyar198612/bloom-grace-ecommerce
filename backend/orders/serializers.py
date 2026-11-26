
from rest_framework import serializers
from django.db import transaction
from products.models import Product
from .models import Order, OrderItem


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'full_name',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'pincode',
            'items',
            'subtotal',
            'shipping_charge',
            'total_amount',
            'status',
        ]
        read_only_fields = [
            'id',
            'order_number',
            'subtotal',
            'shipping_charge',
            'total_amount',
            'status',
        ]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')

        subtotal = 0
        order_products = []

        for item in items_data:
            product = Product.objects.select_for_update().get(
                id=item['product_id'],
                is_active=True
            )

            quantity = item['quantity']

            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Only {product.stock} items available for {product.name}."
                )

            line_total = product.price * quantity
            subtotal += line_total

            order_products.append({
                'product': product,
                'quantity': quantity,
                'line_total': line_total,
            })

        shipping_charge = 0

        order = Order.objects.create(
            **validated_data,
            subtotal=subtotal,
            shipping_charge=shipping_charge,
            total_amount=subtotal + shipping_charge,
        )

        for item in order_products:
            product = item['product']
            quantity = item['quantity']

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                unit_price=product.price,
                quantity=quantity,
                line_total=item['line_total'],
            )

            product.stock -= quantity
            product.save(update_fields=['stock'])

        return order


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_name',
            'unit_price',
            'quantity',
            'line_total',
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'