from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255)
    en_name = models.CharField(max_length=255,default='')
    description = models.TextField(blank=True)
    parent = models.ForeignKey("self", null=True, blank=True, related_name="children", on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'دسته بندی'
        verbose_name_plural = 'دسته بندی ها'
        
    def __str__(self):
        return self.name

class ProductBase(models.Model):
    """
    محصول پایه که اطلاعات عمومی و بدون وابستگی به فروشنده را نگه می‌دارد.
    """
    name = models.CharField(max_length=255)  # نام اصلی محصول
    description = models.TextField(blank=True, null=True)  # توضیحات عمومی
    category = models.ForeignKey(Category, related_name="products", on_delete=models.SET_NULL, null=True)
    attributes = models.JSONField(default=dict, blank=True)  
    # مثال: {"brand": "Apple", "color_options": ["red", "blue"], "storage_options": ["128GB", "256GB"]}

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
            verbose_name = 'محصول پایه'
            verbose_name_plural = 'محصولات پایه'
            
    def __str__(self):
        return self.name

class ProductBaseImage(models.Model):
    """
    تصاویر محصول پایه (برای نمایش به همه فروشندگان)
    """
    product_base = models.ForeignKey(ProductBase, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_base_images/')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_featured = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.alt_text and self.product_base:
            self.alt_text = self.product_base.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_base.name} - {self.alt_text or 'Image'}"
    
class Product(models.Model):
    seller = models.ForeignKey('sellers.Seller', on_delete=models.CASCADE, related_name='products')
    base_product = models.ForeignKey(ProductBase, on_delete=models.CASCADE, related_name='seller_products',null=True, blank=True)

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
            verbose_name = 'محصول'
            verbose_name_plural = 'محصولات'
            
    def __str__(self):
        return f"{self.base_product.name} ({self.seller.store_name})"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_featured = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)
    def save(self, *args, **kwargs):
        if not self.alt_text and self.product:
            self.alt_text = self.product.name
        super().save(*args, **kwargs)
    
class ProductVariant(models.Model):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    attributes = models.JSONField() 

    def __str__(self):
        return f"{self.product.name} - {self.attributes}"

class ProductPriceHistory(models.Model):
    product = models.ForeignKey(Product, related_name="price_history", on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

class SellerOffer(models.Model):
    seller = models.ForeignKey('sellers.Seller', on_delete=models.CASCADE, related_name='offers')
    variant = models.ForeignKey(ProductVariant, related_name='offers', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.variant} by {self.seller.store_name} - {self.price}"

class SellerOfferPriceHistory(models.Model):
    offer = models.ForeignKey(SellerOffer, related_name='price_history', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.offer} price on {self.date}: {self.price}"
