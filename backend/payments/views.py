
import logging
import razorpay

from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from orders.models import Order
from .models import Payment


logger = logging.getLogger(__name__)


# --------------------------------------------------
# RAZORPAY CLIENT
# --------------------------------------------------

def get_razorpay_client():
    key_id = settings.RAZORPAY_KEY_ID
    key_secret = settings.RAZORPAY_KEY_SECRET

    if not key_id or not key_secret:
        raise ValueError(
            "Razorpay credentials are not configured."
        )

    return razorpay.Client(
        auth=(key_id, key_secret)
    )


# --------------------------------------------------
# PAYMENT CONFIRMATION EMAIL
# --------------------------------------------------

def send_payment_confirmation_email(payment):
    order = payment.order

    sender = (
        f"Bloom & Grace <{settings.DEFAULT_FROM_EMAIL}>"
    )

    product_details = []

    for item in order.items.all():
        product_details.append(
            f"- {item.product_name} | "
            f"Quantity: {item.quantity} | "
            f"Amount: Rs. {item.line_total}"
        )

    products_text = "\n".join(product_details)

    subject = (
        f"Payment Successful - {order.order_number}"
    )

    message = (
        f"Dear {order.full_name},\n\n"
        "Thank you for your payment!\n"
        "We have successfully received your payment "
        "for your Bloom & Grace order.\n\n"

        "PAYMENT DETAILS\n"
        "------------------------------\n"
        f"Order Number: {order.order_number}\n"
        f"Payment ID: {payment.razorpay_payment_id}\n"
        f"Payment Amount: Rs. {payment.amount}\n"
        "Payment Method: Razorpay\n"
        f"Payment Status: {payment.get_status_display()}\n\n"

        "ORDERED PRODUCTS\n"
        "------------------------------\n"
        f"{products_text}\n\n"

        "DELIVERY ADDRESS\n"
        "------------------------------\n"
        f"{order.address}, {order.city}, "
        f"{order.state} - {order.pincode}\n\n"

        "Your order is now awaiting processing.\n"
        "You can track your order using your order number "
        "on our website.\n\n"

        "Visit: https://bloom-grace-ecommerce.vercel.app\n\n"

        "Thank you for choosing Bloom & Grace.\n\n"
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


# --------------------------------------------------
# CREATE RAZORPAY ORDER
# --------------------------------------------------

class CreatePaymentOrderAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        order_number = request.data.get("order_number")

        if not order_number:
            return Response(
                {"error": "Order number is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = get_object_or_404(
            Order,
            order_number=order_number
        )

        if order.payment_status == "PAID":
            return Response(
                {"error": "This order has already been paid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            client = get_razorpay_client()

            payment, created = Payment.objects.get_or_create(
                order=order,
                defaults={
                    "amount": order.total_amount,
                    "currency": "INR"
                }
            )

            if payment.status == Payment.Status.PAID:
                return Response(
                    {"error": "This payment is already completed."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create Razorpay order only when required.
            if not payment.razorpay_order_id:

                razorpay_order = client.order.create({
                    "amount": int(
                        order.total_amount * 100
                    ),
                    "currency": "INR",
                    "receipt": order.order_number,
                    "notes": {
                        "order_number": order.order_number
                    }
                })

                payment.razorpay_order_id = (
                    razorpay_order["id"]
                )

                payment.save(
                    update_fields=[
                        "razorpay_order_id",
                        "updated_at"
                    ]
                )

            return Response({
                "key_id": settings.RAZORPAY_KEY_ID,
                "razorpay_order_id": payment.razorpay_order_id,
                "amount": int(
                    order.total_amount * 100
                ),
                "currency": "INR",
                "order_number": order.order_number,
                "customer_name": order.full_name,
                "customer_email": order.email,
                "customer_phone": order.phone,
            })

        except Exception:
            logger.exception(
                "Unable to create Razorpay order."
            )

            return Response(
                {
                    "error": (
                        "Unable to create Razorpay payment order."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY
            )


# --------------------------------------------------
# VERIFY RAZORPAY PAYMENT
# --------------------------------------------------

class VerifyPaymentAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        razorpay_order_id = request.data.get(
            "razorpay_order_id"
        )

        razorpay_payment_id = request.data.get(
            "razorpay_payment_id"
        )

        razorpay_signature = request.data.get(
            "razorpay_signature"
        )

        # Check required payment details.
        if not all([
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        ]):
            return Response(
                {
                    "error": (
                        "Payment verification details are required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        payment = get_object_or_404(
            Payment.objects.select_related("order"),
            razorpay_order_id=razorpay_order_id
        )

        if payment.status == Payment.Status.PAID:
            return Response({
                "success": True,
                "message": "Payment already verified.",
                "order_number": payment.order.order_number
            })

        try:
            client = get_razorpay_client()
            logger.info("VERIFY ORDER ID: %s", razorpay_order_id)
            logger.info("VERIFY PAYMENT ID: %s", razorpay_payment_id)
            # Step 1: Verify Razorpay signature.
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            })

            # Step 2: Fetch payment details from Razorpay.
            gateway_payment = client.payment.fetch(
                razorpay_payment_id
            )

            # Step 3: Validate Razorpay order ID.
            if (
                gateway_payment.get("order_id")
                != razorpay_order_id
            ):
                return Response(
                    {"error": "Payment order does not match."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Step 4: Validate captured payment status.
            if gateway_payment.get("status") != "captured":
                return Response(
                    {
                        "error": (
                            "Payment has not been captured yet."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Step 5: Validate payment amount.
            expected_amount = int(
                payment.amount * 100
            )

            received_amount = int(
                gateway_payment.get("amount", 0)
            )

            if received_amount != expected_amount:
                return Response(
                    {"error": "Payment amount does not match."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Step 6: Update payment record.
            payment.razorpay_payment_id = (
                razorpay_payment_id
            )

            payment.status = Payment.Status.PAID

            payment.save()

            # Step 7: Update order payment status.
            order = payment.order

            order.payment_status = "PAID"

            order.save(
                update_fields=[
                    "payment_status",
                    "updated_at"
                ]
            )

            # Step 8: Send confirmation email only once.
            if not payment.email_sent:

                try:
                    send_payment_confirmation_email(
                        payment
                    )

                    payment.email_sent = True

                    payment.save(
                        update_fields=[
                            "email_sent",
                            "updated_at"
                        ]
                    )

                    logger.info(
                        "Payment confirmation email sent for %s",
                        order.order_number
                    )

                except Exception:
                    logger.exception(
                        "Payment confirmation email failed for %s",
                        order.order_number
                    )

            return Response({
                "success": True,
                "message": "Payment verified successfully.",
                "order_number": order.order_number
            })

        # Signature verification failure.
        except razorpay.errors.SignatureVerificationError as error:

            logger.error(
                "Razorpay signature verification failed: %s",
                str(error)
            )

            return Response(
                {"error": "Invalid payment signature."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Other verification failures.
        except Exception:

            logger.exception(
                "Payment verification failed."
            )

            return Response(
                {"error": "Unable to verify payment."},
                status=status.HTTP_502_BAD_GATEWAY
            )
