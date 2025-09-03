from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller')
    is_legal = models.BooleanField(default=True) 
    national_code = models.CharField(max_length=10)
    shaba_number = models.CharField(max_length=26)
    store_name = models.CharField(max_length=255)
    store_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"{self.store_name} - {self.user.email}"

class SellerProfile(models.Model):
    seller = models.OneToOneField(Seller, on_delete=models.CASCADE, related_name='profile')
    ceo_full_name = models.CharField(max_length=255, blank=True, null=True)
    profile_image = models.ImageField(upload_to='seller_profiles/', blank=True,null=True)

    def __str__(self):
        return f"Profile for {self.seller.store_name} ({self.seller.user.phone_number})"

