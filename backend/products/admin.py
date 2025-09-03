from django.contrib import admin

from .models import (
    Category, ProductBase, Product,
    
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    
@admin.register(ProductBase)
class ProductBaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'created_at')
    class Meta:
        verbose_name = ''
        verbose_name_plural = ''

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'seller', 'get_category', 'created_at')

    def get_category(self, obj):
        return obj.base_product.category.name if obj.base_product and obj.base_product.category else '-'
    get_category.short_description = 'Category'
    
