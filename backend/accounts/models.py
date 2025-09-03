from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import BaseUserManager as BUM


class BaseModel(models.Model):
    created_at = models.DateTimeField(db_index=True, default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class CustomUserManager(BUM):
    def create_user(self, phone_number, is_active = True , is_admin = False, password=None):
        if not phone_number:
            raise ValueError("شماره تلفن باید وارد شود")
        
        user = self.model(phone_number=phone_number,is_active=is_active, is_admin=is_admin)

        if password is not None:
            user.set_password(password)
        else:
            user.set_unusable_password()

    
        user.full_clean()
        user.save(using=self._db)
        
        return user

    def create_superuser(self, phone_number, password = None):
        user = self.create_user(
            phone_number=phone_number,
            is_active = True,
            is_admin=True,
            password = password
        )
        user.is_superuser = True
        user.save(using=self._db)

        return user
    
class CustomUser(BaseModel,AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(
        verbose_name='phone number', 
        unique=True, 
        max_length=11, 
        primary_key=True,
        )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('seller', 'Seller'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')

    objects = CustomUserManager()

    USERNAME_FIELD = "phone_number"

    def __str__(self):
        return self.phone_number
    def is_staff(self):
        return self.is_admin
    
class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE,blank=True)  
    first_name = models.CharField(max_length=60,blank=True)
    last_name = models.CharField(max_length=60,blank=True)
    national_id = models.CharField(max_length=10,blank=True)
    birth_date = models.DateField(null=True,blank=True)
    email = models.CharField(null=True , blank=True)
    shaba_number = models.CharField(null=True , blank=True)
    user_job = models.CharField(null=True , blank=True)
    store_name = models.CharField(max_length=255, blank=True, null=True)
    store_address = models.TextField(blank=True, null=True)
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    