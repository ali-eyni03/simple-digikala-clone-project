from decimal import Decimal
from typing import Optional
from products.models import Product

class DiscountService:
    """Service for handling product discounts and pricing"""
    
    @staticmethod
    def get_effective_price(product) -> Decimal:
        """
        Get the effective price for a product (considering any discounts)
        
        Args:
            product: Product instance
            
        Returns:
            Decimal: The effective price after applying discounts
        """
        base_price = product.price
        if not isinstance(base_price, Decimal):
            base_price = Decimal(str(base_price))
        
        if hasattr(product, 'discount_price') and product.discount_price:
            discount_price = product.discount_price
            if not isinstance(discount_price, Decimal):
                discount_price = Decimal(str(discount_price))
            return discount_price
        
        return base_price
    
    @staticmethod
    def calculate_discount_amount(product: Product, quantity: int = 1) -> Decimal:
        """
        Calculate the total discount amount for a product
        
        Args:
            product: Product instance
            quantity: Quantity of items
            
        Returns:
            Decimal: Total discount amount
        """
        original_price = product.price
        if not isinstance(original_price, Decimal):
            original_price = Decimal(str(original_price))
            
        effective_price = DiscountService.get_effective_price(product)
        discount_per_item = original_price - effective_price
        return discount_per_item * Decimal(str(quantity))
    
    @staticmethod
    def has_discount(product: Product) -> bool:
        """
        Check if a product has any active discount
        
        Args:
            product: Product instance
            
        Returns:
            bool: True if product has discount, False otherwise
        """
        effective_price = DiscountService.get_effective_price(product)
        return effective_price < product.price

class CartService:
    """Service for cart-related operations"""
    
    @staticmethod
    def calculate_cart_totals(cart_items):
        """
        Calculate cart totals including subtotal, shipping, tax, and total
        
        Args:
            cart_items: QuerySet of CartItem objects
            
        Returns:
            dict: Dictionary with totals
        """
        from decimal import Decimal
        
        subtotal = sum(item.total_price for item in cart_items)
        shipping_cost = Decimal('50000')  
        tax_rate = Decimal('0.09')  
        tax_amount = subtotal * tax_rate
        total_amount = subtotal + shipping_cost + tax_amount
        
        return {
            'subtotal': subtotal,
            'shipping_cost': shipping_cost,
            'tax_amount': tax_amount,
            'total_amount': total_amount,
            'total_items': sum(item.quantity for item in cart_items)
        }

class OrderService:
    """Service for order-related operations"""
    
    @staticmethod
    def can_cancel_order(order) -> bool:
        """
        Check if an order can be cancelled
        
        Args:
            order: Order instance
            
        Returns:
            bool: True if order can be cancelled
        """
        cancellable_statuses = ['pending', 'confirmed']
        return order.status in cancellable_statuses
    
    @staticmethod
    def can_return_order(order) -> bool:
        """
        Check if an order can be returned
        
        Args:
            order: Order instance
            
        Returns:
            bool: True if order can be returned
        """
        returnable_statuses = ['delivered']
        return order.status in returnable_statuses
    
    @staticmethod
    def update_order_status(order, new_status: str, notes: Optional[str] = None):
        """
        Update order status and create tracking entry
        
        Args:
            order: Order instance
            new_status: New status for the order
            notes: Optional notes for the status change
        """
        from .models import OrderTracking
        from django.utils import timezone
        
        old_status = order.status
        order.status = new_status
        
        now = timezone.now()
        if new_status == 'shipped':
            order.shipped_at = now
        elif new_status == 'delivered':
            order.delivered_at = now
        elif new_status == 'cancelled':
            order.cancelled_at = now
        
        order.save()
        
        OrderTracking.objects.create(
            order=order,
            status=new_status,
            description=notes or f"وضعیت سفارش از {old_status} به {new_status} تغییر کرد"
        )

class StockService:
    """Service for stock management"""
    
    @staticmethod
    def check_stock_availability(cart_items) -> dict:
        """
        Check stock availability for cart items
        
        Args:
            cart_items: QuerySet of CartItem objects
            
        Returns:
            dict: Dictionary with availability status and errors
        """
        errors = []
        available = True
        
        for item in cart_items:
            if item.quantity > item.product.stock:
                errors.append({
                    'product': item.product.name,
                    'requested': item.quantity,
                    'available': item.product.stock,
                    'message': f'موجودی {item.product.name} کافی نیست. موجودی فعلی: {item.product.stock}'
                })
                available = False
        
        return {
            'available': available,
            'errors': errors
        }
    
    @staticmethod
    def reserve_stock(cart_items):
        """
        Reserve stock for cart items (decrease stock)
        
        Args:
            cart_items: QuerySet of CartItem objects
        """
        for item in cart_items:
            product = item.product
            product.stock -= item.quantity
            product.save()
    
    @staticmethod
    def release_stock(order_items):
        """
        Release reserved stock (increase stock back)
        
        Args:
            order_items: QuerySet of OrderItem objects
        """
        for item in order_items:
            product = item.product
            product.stock += item.quantity
            product.save()