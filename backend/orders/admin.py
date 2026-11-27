
import logging
from django.contrib import admin, messages
from django.conf import settings
from django.core.mail import send_mail
from .models import Order, OrderItem

logger = logging.getLogger(__name__)


def send_shipping_update_email(order):
    subject = f"Shipping Update | Bloom & Grace | {order.order_number}"

    message = (
        f"Hello {order.full_name},\n\n"
        "Your Bloom & Grace order is on its way!\n\n"
        f"Order Number: {order.order_number}\n"
        f"Order Status: {order.get_status_display()}\n"
        f"Order Amount: Rs. {order.total_amount}\n\n"
        "Delivery Address:\n"
        f"{order.address}, {order.city}, "
        f"{order.state} - {order.pincode}\n\n"
        "You can visit our website to track your order:\n"
        "https://bloom-grace-ecommerce.vercel.app\n\n"
        "Thank you for shopping with Bloom & Grace.\n\n"
        "Regards,\n"
        "Bloom & Grace Team"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        fail_silently=False,
    )


def send_delivery_confirmation_email(order):
    subject = f"Delivery Completed | Bloom & Grace | {order.order_number}"

    message = (
        f"Hello {order.full_name},\n\n"
        "Your Bloom & Grace order has been delivered successfully.\n\n"
        "Order Details:\n"
        f"Order Number: {order.order_number}\n"
        f"Delivery Status: {order.get_status_display()}\n"
        f"Order Amount: Rs. {order.total_amount}\n\n"
        "We hope you are happy with your purchase.\n\n"
        "Thank you for choosing Bloom & Grace.\n\n"
        "Visit our website:\n"
        "https://bloom-grace-ecommerce.vercel.app\n\n"
        "Regards,\n"
        "Bloom & Grace Team"
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[order.email],
        fail_silently=False,
    )


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        'product_name',
        'unit_price',
        'quantity',
        'line_total',
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number',
        'full_name',
        'email',
        'total_amount',
        'status',
        'created_at',
    )

    list_filter = ('status', 'created_at')

    search_fields = (
        'order_number',
        'full_name',
        'email',
        'phone',
    )

    readonly_fields = (
        'order_number',
        'subtotal',
        'shipping_charge',
        'total_amount',
        'created_at',
        'updated_at',
    )

    inlines = [OrderItemInline]

    def save_model(self, request, obj, form, change):
        previous_status = None

        if change:
            previous_status = (
                Order.objects.filter(pk=obj.pk)
                .values_list('status', flat=True)
                .first()
            )

        super().save_model(request, obj, form, change)

        if not change or previous_status == obj.status:
            return

        try:
            if obj.status == 'SHIPPED':
                send_shipping_update_email(obj)
                self.message_user(
                    request,
                    f'Shipping email sent successfully for {obj.order_number}.',
                    level=messages.SUCCESS,
                )

            elif obj.status == 'DELIVERED':
                send_delivery_confirmation_email(obj)
                self.message_user(
                    request,
                    f'Delivery confirmation email sent successfully for {obj.order_number}.',
                    level=messages.SUCCESS,
                )

        except Exception:
            logger.exception(
                'Order status email failed for %s',
                obj.order_number,
            )
            self.message_user(
                request,
                'Email could not be sent. Please check the backend terminal.',
                level=messages.ERROR,
            )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        'product_name',
        'order',
        'quantity',
        'unit_price',
        'line_total',
    )

    search_fields = (
        'product_name',
        'order__order_number',
    )
