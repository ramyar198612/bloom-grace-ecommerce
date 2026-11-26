
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import (
    SiteSettings,
    NavigationItem,
    HeroSection,
    HomeSection,
    AboutPageContent,
    ContactPageContent,
    FooterLink,
    Testimonial,
)

from .serializers import (
    SiteSettingsSerializer,
    NavigationItemSerializer,
    HeroSectionSerializer,
    HomeSectionSerializer,
    AboutPageContentSerializer,
    ContactPageContentSerializer,
    FooterLinkSerializer,
    TestimonialSerializer,
)


class WebsiteContentAPIView(APIView):

    def get(self, request):

        settings = SiteSettings.objects.first()
        hero = HeroSection.objects.filter(is_active=True).order_by("order").first()
        about = AboutPageContent.objects.filter(is_active=True).first()
        contact = ContactPageContent.objects.filter(is_active=True).first()

        data = {
            "settings": (
                SiteSettingsSerializer(settings, context={"request": request}).data
                if settings else None
            ),

            "navigation": NavigationItemSerializer(
                NavigationItem.objects.filter(is_active=True),
                many=True,
                context={"request": request}
            ).data,

            "hero": (
                HeroSectionSerializer(hero, context={"request": request}).data
                if hero else None
            ),

            "home_sections": HomeSectionSerializer(
                HomeSection.objects.filter(is_active=True),
                many=True,
                context={"request": request}
            ).data,

            "about": (
                AboutPageContentSerializer(about, context={"request": request}).data
                if about else None
            ),

            "contact": (
                ContactPageContentSerializer(contact, context={"request": request}).data
                if contact else None
            ),

            "footer_links": FooterLinkSerializer(
                FooterLink.objects.filter(is_active=True),
                many=True,
                context={"request": request}
            ).data,

            "testimonials": TestimonialSerializer(
                Testimonial.objects.filter(is_active=True),
                many=True,
                context={"request": request}
            ).data,
        }

        return Response(data)
