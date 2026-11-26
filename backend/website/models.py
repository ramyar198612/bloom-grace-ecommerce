
from django.db import models


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=150, default="Bloom & Grace")
    tagline = models.CharField(max_length=250, blank=True)
    logo = models.ImageField(upload_to="website/logo/", blank=True, null=True)
    announcement_text = models.CharField(max_length=250, blank=True)
    free_shipping_message = models.CharField(max_length=250, blank=True)

    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    pinterest_url = models.URLField(blank=True)

    copyright_text = models.CharField(max_length=250, blank=True)
    footer_quick_links_heading = models.CharField(
    max_length=100,
    default="Quick Links"
)

    footer_support_heading = models.CharField(
    max_length=100,
    default="Customer Support"
)

    footer_contact_heading = models.CharField(
    max_length=100,
    default="Contact Us"
)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.site_name

    class Meta:
        verbose_name = "Website Settings"
        verbose_name_plural = "Website Settings"


class NavigationItem(models.Model):
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=250)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["order"]
        verbose_name = "Navigation Item"
        verbose_name_plural = "Navigation Items"


class HeroSection(models.Model):
    heading = models.CharField(max_length=250)
    highlighted_text = models.CharField(max_length=150, blank=True)
    subtitle = models.CharField(max_length=250, blank=True)
    description = models.TextField(blank=True)

    image = models.ImageField(upload_to="website/hero/")

    button_text = models.CharField(max_length=100, blank=True)
    button_url = models.CharField(max_length=250, blank=True)

    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.heading

    class Meta:
        ordering = ["order"]
class HomeSection(models.Model):
    class SectionType(models.TextChoices):
        CATEGORIES = "CATEGORIES", "Categories"
        FEATURED_PRODUCTS = "FEATURED_PRODUCTS", "Featured Products"
        PROMOTIONAL_BANNER = "PROMOTIONAL_BANNER", "Promotional Banner"
        ABOUT_PREVIEW = "ABOUT_PREVIEW", "About Preview"
        TESTIMONIALS = "TESTIMONIALS", "Testimonials"
        NEWSLETTER = "NEWSLETTER", "Newsletter"

    section_type = models.CharField(
        max_length=30,
        choices=SectionType.choices
    )

    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=250, blank=True)
    description = models.TextField(blank=True)

    image = models.ImageField(
        upload_to="website/home-sections/",
        blank=True,
        null=True
    )

    button_text = models.CharField(max_length=100, blank=True)
    button_url = models.CharField(max_length=250, blank=True)

    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["order"]


class AboutPageContent(models.Model):
    heading = models.CharField(max_length=250)
    subtitle = models.CharField(max_length=250, blank=True)
    description = models.TextField()

    image_one = models.ImageField(
        upload_to="website/about/",
        blank=True,
        null=True
    )
    image_two = models.ImageField(
        upload_to="website/about/",
        blank=True,
        null=True
    )

    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.heading


class ContactPageContent(models.Model):
    heading = models.CharField(max_length=250)
    description = models.TextField(blank=True)

    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    business_hours = models.TextField(blank=True)
    map_url = models.URLField(blank=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.heading


class FooterLink(models.Model):
    class LinkType(models.TextChoices):
        QUICK_LINK = "QUICK_LINK", "Quick Link"
        SUPPORT = "SUPPORT", "Customer Support"

    link_type = models.CharField(
        max_length=20,
        choices=LinkType.choices
    )

    title = models.CharField(max_length=100)
    url = models.CharField(max_length=250)

    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["order"]


class Testimonial(models.Model):
    customer_name = models.CharField(max_length=150)
    message = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    customer_image = models.ImageField(
        upload_to="website/testimonials/",
        blank=True,
        null=True
    )

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.customer_name

    class Meta:
        ordering = ["-created_at"]
