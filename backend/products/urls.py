
from django.urls import path
from .views import SellerProductCreateView
from .views import (
    ProductSearchView,
    SellerOfferCreateView,
    SellerProductCreateView,
    CategoryListView,
    SellerProductListView,
    SellerProductDetailView,
    ProductStatsView
)
from .views import (
    PublicProductListView,
    PublicProductDetailView,
    PublicCategoryListView,
)
urlpatterns = [
    path('products/', SellerProductCreateView.as_view(), name='seller-products'),
    path('public/list/', PublicProductListView.as_view(), name='public-product-list'),
    path('public/<int:pk>/', PublicProductDetailView.as_view(), name='public-product-detail'),
    path('categories/public/', PublicCategoryListView.as_view(), name='public-category-list'),
    path('search/', ProductSearchView.as_view(), name='product-search'),
    path('offer/create/', SellerOfferCreateView.as_view(), name='seller-offer-create'),
    path('create/', SellerProductCreateView.as_view(), name='seller-product-create'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('seller/list/', SellerProductListView.as_view(), name='seller-product-list'),
    path('seller/<int:pk>/', SellerProductDetailView.as_view(), name='seller-product-detail'),
    path('seller/stats/', ProductStatsView.as_view(), name='seller-product-stats'),
]