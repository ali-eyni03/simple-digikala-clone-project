# permissions.py
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from .models import Seller

class IsSellerPermission(permissions.BasePermission):
    """
    Custom permission to only allow sellers to access seller-specific views.
    """
    
    def has_permission(self, request, view):
      
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            seller = Seller.objects.get(user=request.user)
            return True
        except Seller.DoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'seller'):
            return obj.seller.user == request.user
        return True

class IsSellerOwnerPermission(permissions.BasePermission):
    """
    Custom permission to only allow sellers to access their own objects.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        try:
            Seller.objects.get(user=request.user)
            return True
        except Seller.DoesNotExist:
            return False

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'seller'):
            return obj.seller.user == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        return False

class IsAuthenticatedOrSellerRegister(permissions.BasePermission):
    """
    Permission for seller registration - allows authenticated users who are not sellers yet.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.method == 'POST':
            try:
                Seller.objects.get(user=request.user)
                raise PermissionDenied("شما قبلاً به عنوان فروشنده ثبت نام کرده‌اید.")
            except Seller.DoesNotExist:
                return True
        
        try:
            Seller.objects.get(user=request.user)
            return True
        except Seller.DoesNotExist:
            return False