from django.urls import path
from .views import (
    CartView, AddToCartView, UpdateCartItemView, RemoveFromCartView, ClearCartView,
    CreateOrderView, OrderListView, OrderDetailView, OrderByNumberView, CancelOrderView,
    WishlistView, AddToWishlistView, RemoveFromWishlistView,
)

app_name = 'orders'

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', AddToCartView.as_view(), name='add_to_cart'),
    path('cart/items/<int:item_id>/update/', UpdateCartItemView.as_view(), name='update_cart_item'),
    path('cart/items/<int:item_id>/remove/', RemoveFromCartView.as_view(), name='remove_from_cart'),
    path('cart/clear/', ClearCartView.as_view(), name='clear_cart'),
    path('orders/', OrderListView.as_view(), name='order_list'),
    path('orders/create/', CreateOrderView.as_view(), name='create_order'),
    path('orders/<int:order_id>/', OrderDetailView.as_view(), name='order_detail'),
    path('orders/<int:order_id>/cancel/', CancelOrderView.as_view(), name='cancel_order'),
    path('orders/number/<str:order_number>/', OrderByNumberView.as_view(), name='order_by_number'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist/add/<int:product_id>/', AddToWishlistView.as_view(), name='add_to_wishlist'),
    path('wishlist/remove/<int:product_id>/', RemoveFromWishlistView.as_view(), name='remove_from_wishlist'),
]