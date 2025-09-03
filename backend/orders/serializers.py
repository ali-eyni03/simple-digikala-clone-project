from rest_framework import serializers
from .models import Cart, CartItem, Order, OrderItem, Wishlist
from products.models import Product

class CartItemProductSerializer(serializers.ModelSerializer):
    """Serializer for product info in cart items"""
    main_image = serializers.SerializerMethodField()
    seller_name = serializers.CharField(source='seller.store_name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'main_image', 'seller_name']
    
    def get_main_image(self, obj):
        request = self.context.get('request')
        main_image = obj.images.filter(is_featured=True).first()
        if not main_image:
            main_image = obj.images.first()
        
        if main_image and request:
            return request.build_absolute_uri(main_image.image.url)
        elif main_image:
            return main_image.image.url
        return None

class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items"""
    product = CartItemProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'created_at', 'updated_at']

class CartSerializer(serializers.ModelSerializer):
    """Serializer for shopping cart"""
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'total_price', 'created_at', 'updated_at']

class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating new orders"""
    shipping_name = serializers.CharField(max_length=255)
    shipping_phone = serializers.CharField(max_length=20)
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    payment_method = serializers.ChoiceField(
        choices=Order.PAYMENT_METHOD_CHOICES,
        default='cash_on_delivery'
    )
    notes = serializers.CharField(required=False, allow_blank=True)

class OrderItemProductSerializer(serializers.ModelSerializer):
    """Serializer for product info in order items"""
    main_image = serializers.SerializerMethodField()
    seller_name = serializers.CharField(source='seller.store_name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'main_image', 'seller_name']
    
    def get_main_image(self, obj):
        request = self.context.get('request')
        main_image = obj.images.filter(is_featured=True).first()
        if not main_image:
            main_image = obj.images.first()
        
        if main_image and request:
            return request.build_absolute_uri(main_image.image.url)
        elif main_image:
            return main_image.image.url
        return None

class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    product = OrderItemProductSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']

class OrderListSerializer(serializers.ModelSerializer):
    """Serializer for order list (summary view)"""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    total_items = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'payment_method', 'payment_method_display',
            'payment_status', 'payment_status_display',
            'total_amount', 'total_items',
            'created_at', 'updated_at'
        ]

class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed order view"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    total_items = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'status_display',
            'shipping_name', 'shipping_phone', 'shipping_address',
            'shipping_city', 'shipping_postal_code',
            'subtotal', 'shipping_cost', 'tax_amount', 'total_amount',
            'payment_method', 'payment_method_display',
            'payment_status', 'payment_status_display',
            'notes', 'total_items', 'items',
            'created_at', 'updated_at'
        ]

class WishlistProductSerializer(serializers.ModelSerializer):
    """Serializer for product info in wishlist"""
    main_image = serializers.SerializerMethodField()
    seller_name = serializers.CharField(source='seller.store_name', read_only=True)
    is_available = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'stock', 'main_image', 'seller_name', 'is_available']
    
    def get_main_image(self, obj):
        request = self.context.get('request')
        main_image = obj.images.filter(is_featured=True).first()
        if not main_image:
            main_image = obj.images.first()
        
        if main_image and request:
            return request.build_absolute_uri(main_image.image.url)
        elif main_image:
            return main_image.image.url
        return None
    
    def get_is_available(self, obj):
        return obj.stock > 0

class WishlistSerializer(serializers.ModelSerializer):
    """Serializer for wishlist items"""
    product = WishlistProductSerializer(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'created_at']