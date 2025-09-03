from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction
from drf_spectacular.utils import extend_schema
from .models import Cart, CartItem, Order, OrderItem, Wishlist
from products.models import Product
from .serializers import (
    CartSerializer, CartItemSerializer, OrderDetailSerializer, 
    OrderCreateSerializer, OrderListSerializer, WishlistSerializer
)
from decimal import Decimal
from .services import DiscountService


class CartView(APIView):
    """Get user's cart with all items"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=CartSerializer)
    def get(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            serializer = CartSerializer(cart, context={'request': request})
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({
                'id': None,
                'user': request.user.phone_number,
                'items': [],
                'total_items': 0,
                'total_price': 0,
                'created_at': None,
                'updated_at': None
            })

class AddToCartView(APIView):
    """Add product to cart"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        request=CartItemSerializer,
        responses=CartSerializer
    )
    def post(self, request):
        try:
            product_id = request.data.get('product_id')
            quantity = request.data.get('quantity', 1)
            
            if not product_id:
                return Response(
                    {'detail': 'شناسه محصول الزامی است'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response(
                    {'detail': 'محصول یافت نشد'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if quantity > product.stock:
                return Response(
                    {'detail': f'موجودی کافی نیست. موجودی فعلی: {product.stock}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart, created = Cart.objects.get_or_create(user=request.user)            
            cart_item, item_created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not item_created:
                new_quantity = cart_item.quantity + quantity
                if new_quantity > product.stock:
                    return Response(
                        {'detail': f'مجموع تعداد از موجودی بیشتر است. موجودی فعلی: {product.stock}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                cart_item.quantity = new_quantity
                cart_item.save()
            
            serializer = CartSerializer(cart, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'detail': f'خطا در افزودن به سبد خرید: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class UpdateCartItemView(APIView):
    """Update cart item quantity"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        request=CartItemSerializer,
        responses=CartSerializer
    )
    def put(self, request, item_id):
        try:
            quantity = request.data.get('quantity')
            
            if quantity is None or quantity < 1:
                return Response(
                    {'detail': 'تعداد باید بیشتر از صفر باشد'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                cart_item = CartItem.objects.get(
                    id=item_id,
                    cart__user=request.user
                )
            except CartItem.DoesNotExist:
                return Response(
                    {'detail': 'آیتم سبد خرید یافت نشد'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            if quantity > cart_item.product.stock:
                return Response(
                    {'detail': f'موجودی کافی نیست. موجودی فعلی: {cart_item.product.stock}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart_item.quantity = quantity
            cart_item.save()
            
            serializer = CartSerializer(cart_item.cart, context={'request': request})
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'detail': f'خطا در بروزرسانی سبد خرید: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class RemoveFromCartView(APIView):
    """Remove item from cart"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=CartSerializer)
    def delete(self, request, item_id):
        try:
            cart_item = CartItem.objects.get(
                id=item_id,
                cart__user=request.user
            )
            cart = cart_item.cart
            cart_item.delete()
            
            serializer = CartSerializer(cart, context={'request': request})
            return Response(serializer.data)
            
        except CartItem.DoesNotExist:
            return Response(
                {'detail': 'آیتم سبد خرید یافت نشد'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'detail': f'خطا در حذف از سبد خرید: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class ClearCartView(APIView):
    """Clear all items from cart"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses={'message': 'سبد خرید خالی شد'})
    def delete(self, request):
        try:
            cart = Cart.objects.get(user=request.user)
            cart.items.all().delete()
            return Response({'message': 'سبد خرید خالی شد'})
        except Cart.DoesNotExist:
            return Response({'message': 'سبد خرید خالی است'})

class CreateOrderView(APIView):
    """Create order from cart items"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        request=OrderCreateSerializer,
        responses=OrderDetailSerializer
    )
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            with transaction.atomic():
                try:
                    cart = Cart.objects.get(user=request.user)
                except Cart.DoesNotExist:
                    return Response(
                        {'detail': 'سبد خرید خالی است'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                cart_items = cart.items.all()
                if not cart_items:
                    return Response(
                        {'detail': 'سبد خرید خالی است'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                for cart_item in cart_items:
                    if cart_item.quantity > cart_item.product.stock:
                        return Response(
                            {'detail': f'موجودی {cart_item.product.name} کافی نیست. موجودی فعلی: {cart_item.product.stock}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                
                
                subtotal = Decimal('0')
                for item in cart_items:
                    item_price = item.product.price
                    if not isinstance(item_price, Decimal):
                        item_price = Decimal(str(item_price))
                    subtotal += Decimal(str(item.quantity)) * item_price
                
                shipping_cost = Decimal('50000')  
                tax_rate = Decimal('0.09') 
                tax_amount = subtotal * tax_rate
                total_amount = subtotal + shipping_cost + tax_amount
                
                order = Order.objects.create(
                    user=request.user,
                    shipping_name=serializer.validated_data['shipping_name'],
                    shipping_phone=serializer.validated_data['shipping_phone'],
                    shipping_address=serializer.validated_data['shipping_address'],
                    shipping_city=serializer.validated_data['shipping_city'],
                    shipping_postal_code=serializer.validated_data['shipping_postal_code'],
                    subtotal=subtotal,
                    shipping_cost=shipping_cost,
                    tax_amount=tax_amount,
                    total_amount=total_amount,
                    payment_method=serializer.validated_data.get('payment_method', 'cash_on_delivery'),
                    notes=serializer.validated_data.get('notes', ''),
                    status='confirmed'
                )
                
                for cart_item in cart_items:
                    try:
                        effective_price = DiscountService.get_effective_price(cart_item.product)
                    except:
                        effective_price = cart_item.product.price
                    
                    if not isinstance(effective_price, Decimal):
                        effective_price = Decimal(str(effective_price))
                    
                    OrderItem.objects.create(
                        order=order,
                        product=cart_item.product,
                        quantity=int(cart_item.quantity),
                        price=effective_price,
                        discount_amount=Decimal('0') 
                    )
                    
                    cart_item.product.stock -= cart_item.quantity
                    cart_item.product.save()
                
                cart.items.all().delete()
                
                order_serializer = OrderDetailSerializer(order, context={'request': request})
                return Response(order_serializer.data, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            print(f"Order creation error: {str(e)}")
            return Response(
                {'detail': f'خطا در ثبت سفارش: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class OrderListView(APIView):
    """Get user's orders list"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=OrderListSerializer(many=True))
    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        
        status_filter = request.query_params.get('status')
        if status_filter:
            orders = orders.filter(status=status_filter)
        
        serializer = OrderListSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)

class OrderDetailView(APIView):
    """Get order details"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=OrderDetailSerializer)
    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        serializer = OrderDetailSerializer(order, context={'request': request})
        return Response(serializer.data)

class OrderByNumberView(APIView):
    """Get order by order number"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=OrderDetailSerializer)
    def get(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number, user=request.user)
        serializer = OrderDetailSerializer(order, context={'request': request})
        return Response(serializer.data)

class CancelOrderView(APIView):
    """Cancel an order"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=OrderDetailSerializer)
    def post(self, request, order_id):
        try:
            order = get_object_or_404(Order, id=order_id, user=request.user)
            
            if order.status not in ['pending', 'confirmed']:
                return Response(
                    {'detail': 'این سفارش قابل لغو نیست'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                for order_item in order.items.all():
                    product = order_item.product
                    product.stock += order_item.quantity
                    product.save()
                
                order.status = 'cancelled'
                order.save()
            
            serializer = OrderDetailSerializer(order, context={'request': request})
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'detail': f'خطا در لغو سفارش: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class WishlistView(APIView):
    """Get user's wishlist"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=WishlistSerializer(many=True))
    def get(self, request):
        wishlist_items = Wishlist.objects.filter(user=request.user).order_by('-created_at')
        serializer = WishlistSerializer(wishlist_items, many=True, context={'request': request})
        return Response(serializer.data)

class AddToWishlistView(APIView):
    """Add product to wishlist"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses={'message': 'محصول به علاقه‌مندی‌ها اضافه شد'})
    def post(self, request, product_id):
        try:
            product = get_object_or_404(Product, id=product_id)
            
            wishlist_item, created = Wishlist.objects.get_or_create(
                user=request.user,
                product=product
            )
            
            if created:
                return Response(
                    {'message': 'محصول به علاقه‌مندی‌ها اضافه شد'},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {'message': 'محصول قبلاً در علاقه‌مندی‌ها موجود است'},
                    status=status.HTTP_200_OK
                )
                
        except Exception as e:
            return Response(
                {'detail': f'خطا در افزودن به علاقه‌مندی‌ها: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

class RemoveFromWishlistView(APIView):
    """Remove product from wishlist"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses={'message': 'محصول از علاقه‌مندی‌ها حذف شد'})
    def delete(self, request, product_id):
        try:
            wishlist_item = get_object_or_404(
                Wishlist,
                user=request.user,
                product_id=product_id
            )
            wishlist_item.delete()
            
            return Response({'message': 'محصول از علاقه‌مندی‌ها حذف شد'})
            
        except Exception as e:
            return Response(
                {'detail': f'خطا در حذف از علاقه‌مندی‌ها: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )