
import os

from groq import Groq
from products.models import Product

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status


class ChatbotAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        conversation = request.data.get('history', [])

        if not user_message:
            return Response(
                {'error': 'Please enter a message.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        api_key = os.getenv('GROQ_API_KEY')

        if not api_key:
            return Response(
                {'error': 'Groq API key is not configured.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            # Get real products from Django database
            products = Product.objects.filter(
                is_active=True
            ).select_related('category')

            product_details = []

            for product in products:
                product_details.append(
                    f"""
                    Product: {product.name}
                    Category: {product.category.name}
                    Description: {product.description}
                    Price: Rs. {product.price}
                    Original Price: {product.original_price or 'Not available'}
                    Stock: {product.stock}
                    Availability: {
                        'In Stock' if product.stock > 0 else 'Out of Stock'
                    }
                    """
                )

            product_catalog = (
                '\n'.join(product_details)
                if product_details
                else 'No active products are currently available.'
            )

            system_prompt = f"""
            You are Bloom & Grace AI Shopping Assistant.

            Bloom & Grace sells artificial flowers and hair accessories.

            Here are the actual products from our store database:

            {product_catalog}

            IMPORTANT INSTRUCTIONS:

            1. Recommend only products listed in the product catalog.
            2. Always use the actual product prices shown above.
            3. Never invent product names, prices or stock information.
            4. Do not recommend out-of-stock products as available.
            5. If a product is unavailable, politely inform the customer.
            6. Help customers find products within their budget.
            7. Answer questions about artificial flowers and hair accessories.
            8. For order tracking, ask the customer to use the Track Order page.
            9. Do not invent shipping charges, delivery dates or return policies.
            10. Be polite, friendly and professional.
            11. Reply in the same language used by the customer.
            12. Keep answers clear and concise.

            Your name is Bloom & Grace AI Shopping Assistant.
            """

            client = Groq(api_key=api_key)

            messages = [
                {
                    'role': 'system',
                    'content': system_prompt
                }
            ]

            # Add recent conversation history
            if isinstance(conversation, list):
                for item in conversation[-10:]:
                    if not isinstance(item, dict):
                        continue

                    role = item.get('role')
                    content = item.get('content')

                    if role in ['user', 'assistant'] and isinstance(content, str):
                        messages.append({
                            'role': role,
                            'content': content[:2000]
                        })

            messages.append({
                'role': 'user',
                'content': user_message[:2000]
            })

            completion = client.chat.completions.create(
                model='openai/gpt-oss-120b',
                messages=messages,
                temperature=0.5,
                max_tokens=500
            )

            answer = completion.choices[0].message.content

            return Response({
                'reply': answer
            })

        except Exception as error:
            print('Groq Chatbot Error:', str(error))

            return Response(
                {
                    'error': 'Sorry, the chatbot is temporarily unavailable. Please try again.'
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
