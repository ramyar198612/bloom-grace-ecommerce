
from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'price',
        'stock',
        'is_featured',
        'is_active',
    )
    list_filter = ('category', 'is_featured', 'is_active')
    search_fields = ('name', 'sku')
    list_editable = ('price', 'stock', 'is_featured', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
