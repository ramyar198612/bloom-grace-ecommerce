
from django.contrib import admin
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


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("site_name", "contact_email", "contact_phone", "updated_at")


@admin.register(NavigationItem)
class NavigationItemAdmin(admin.ModelAdmin):
    list_display = ("title", "url", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title",)


@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    list_display = ("heading", "button_text", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("heading",)


@admin.register(HomeSection)
class HomeSectionAdmin(admin.ModelAdmin):
    list_display = ("title", "section_type", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("section_type", "is_active")
    search_fields = ("title",)


@admin.register(AboutPageContent)
class AboutPageContentAdmin(admin.ModelAdmin):
    list_display = ("heading", "is_active")
    list_filter = ("is_active",)


@admin.register(ContactPageContent)
class ContactPageContentAdmin(admin.ModelAdmin):
    list_display = ("heading", "email", "phone", "is_active")
    list_filter = ("is_active",)


@admin.register(FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    list_display = ("title", "link_type", "url", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("link_type", "is_active")
    search_fields = ("title",)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "rating", "is_active", "created_at")
    list_filter = ("rating", "is_active")
    search_fields = ("customer_name",)
