
from django.conf import settings
from django.core.mail import send_mail

from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer


def send_order_confirmation_email(order):
    sender = f"Bloom & Grace <{settings.DEFAULT_FROM_EMAIL}>"

    product_details = []

    for item in order.items.all():
        product_details.append(
            f"- {item.product_name} | "
            f"Quantity: {item.quantity} | "
            f"Price: Rs. {item.line_total}"
        )

    products_text = "\n".join(product_details)

    delivery_address = (
        f"{order.address},\n"
        f"{order.city}, {order.state} - {order.pincode}"
    )

    subject = f"Order Confirmation - {order.order_number}"

    message = (
        f"Dear {order.full_name},\n\n"
        "Thank you for shopping with Bloom & Grace!\n"
        "Your order has been successfully placed.\n\n"
        "ORDER DETAILS\n"
        "------------------------------\n"
        f"Order Number: {order.order_number}\n"
        f"Order Date: {order.created_at.strftime('%d-%m-%Y %I:%M %p')}\n"
        f"Order Status: {order.status}\n"
        f"Payment Status: {order.payment_status}\n\n"
        "PRODUCTS\n"
        "------------------------------\n"
        f"{products_text}\n\n"
        "PAYMENT SUMMARY\n"
        "------------------------------\n"
        f"Subtotal: Rs. {order.subtotal}\n"
        f"Shipping Charge: Rs. {order.shipping_charge}\n"
        f"Total Amount: Rs. {order.total_amount}\n\n"
        "DELIVERY ADDRESS\n"
        "------------------------------\n"
        f"{delivery_address}\n\n"
        "You can track your order using your order number "
        "on our website.\n\n"
        "Visit: https://bloom-grace-ecommerce.vercel.app\n\n"
        "Thank you for choosing Bloom & Grace.\n"
        "We look forward to serving you!\n\n"
        "Warm regards,\n"
        "Bloom & Grace Team"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=sender,
        recipient_list=[order.email],
        fail_silently=False,
    )


class OrderCreateAPIView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        order = serializer.save()

        # Send confirmation email without interrupting order creation.
        try:
            send_order_confirmation_email(order)
        except Exception as error:
            print(
                f"Order confirmation email failed "
                f"for {order.order_number}: {error}"
            )


class OrderDetailAPIView(generics.RetrieveAPIView):
    queryset = Order.objects.prefetch_related('items').all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]
    lookup_field = 'order_number'
