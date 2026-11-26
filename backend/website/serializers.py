
from rest_framework import serializers
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


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = "__all__"


class NavigationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavigationItem
        fields = "__all__"


class HeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSection
        fields = "__all__"


class HomeSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeSection
        fields = "__all__"


class AboutPageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPageContent
        fields = "__all__"


class ContactPageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactPageContent
        fields = "__all__"


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLink
        fields = "__all__"


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"
