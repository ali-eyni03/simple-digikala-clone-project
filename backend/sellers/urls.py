from django.urls import path
from .views import (
    SellerApiView, 
    SellerRegisterApiView, 
    SellerDashboardView,
    SellerStatusCheckView,
    SellerProfileDetailView,
    SellerProfileUpdateView
)

urlpatterns = [
    path('register/', SellerRegisterApiView.as_view(), name='seller-register'),
    path('profile/', SellerApiView.as_view(), name='seller-profile'),
    path('profile/update/', SellerProfileUpdateView.as_view(), name='seller-profile-update'),
    path('profile/detail/', SellerProfileDetailView.as_view(), name='seller-profile-detail'),  
    path('dashboard/', SellerDashboardView.as_view(), name='seller-dashboard'),
    path('status/', SellerStatusCheckView.as_view(), name='seller-status'),
]
