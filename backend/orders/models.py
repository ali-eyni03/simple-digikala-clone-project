from django.db import models
from django.contrib.auth import get_user_model
import uuid
from datetime import datetime

User = get_user_model()

class Cart(models.Model):
    """Shopping cart for users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'سبد خرید'
        verbose_name_plural = 'سبدهای خرید'
    
    @property
    def total_items(self):
        """Total number of items in cart"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def total_price(self):
        """Total price of all items in cart"""
        from decimal import Decimal
        return sum(item.total_price for item in self.items.all()) or Decimal('0')
    
    def __str__(self):
        return f"سبد خرید {self.user.phone_number}"

class CartItem(models.Model):
    """Individual items in a cart"""
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'آیتم سبد خرید'
        verbose_name_plural = 'آیتم‌های سبد خرید'
        unique_together = ('cart', 'product')
    
    @property
    def total_price(self):
        """Total price for this cart item (quantity * product price)"""
        from decimal import Decimal
        
        try:
            from .services import DiscountService
            effective_price = DiscountService.get_effective_price(self.product)
            return Decimal(str(self.quantity)) * effective_price
        except:
            return Decimal(str(self.quantity)) * self.product.price
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

class Order(models.Model):
    """Customer orders - minimal version"""
    ORDER_STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('confirmed', 'تأیید شده'),
        ('processing', 'در حال پردازش'),
        ('shipped', 'ارسال شده'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
        ('returned', 'مرجوع شده'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('cash_on_delivery', 'پرداخت در محل'),
        ('online', 'پرداخت آنلاین'),
        ('bank_transfer', 'انتقال بانکی'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'در انتظار'),
        ('paid', 'پرداخت شده'),
        ('failed', 'ناموفق'),
        ('refunded', 'بازگردانده شده'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=20, unique=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    
    shipping_name = models.CharField(max_length=255)
    shipping_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash_on_delivery')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    notes = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'سفارش'
        verbose_name_plural = 'سفارشات'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate order number based on current date and time
            now = datetime.now()
            timestamp = now.strftime('%Y%m%d%H%M%S')
            self.order_number = f"ORD-{timestamp}"
        super().save(*args, **kwargs)
    
    @property
    def total_items(self):
        """Total number of items in order"""
        return sum(item.quantity for item in self.items.all())
    
    def __str__(self):
        return f"سفارش {self.order_number} - {self.user.phone_number}"

class OrderItem(models.Model):
    """Individual items in an order"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)  # Price at time of order
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Keep for compatibility
    
    class Meta:
        verbose_name = 'آیتم سفارش'
        verbose_name_plural = 'آیتم‌های سفارش'
    
    @property
    def total_price(self):
        """Total price for this order item"""
        from decimal import Decimal
        return (self.price - self.discount_amount) * Decimal(str(self.quantity))
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity} - {self.order.order_number}"

class Wishlist(models.Model):
    """User wishlist for favorite products"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'علاقه‌مندی'
        verbose_name_plural = 'علاقه‌مندی‌ها'
    
    def __str__(self):
        product_name = self.product.name if self.product else "نامشخص"
        return f"{self.user.phone_number} - {product_name}"