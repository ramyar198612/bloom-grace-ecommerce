
from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'order',
        'razorpay_order_id',
        'razorpay_payment_id',
        'amount',
        'status',
        'created_at',
    )
    list_filter = ('status', 'currency')
    search_fields = (
        'order__order_number',
        'razorpay_order_id',
        'razorpay_payment_id',
    )
    readonly_fields = (
        'razorpay_order_id',
        'razorpay_payment_id',
        'created_at',
        'updated_at',
    )
