from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Seller

User = get_user_model()
STATIC_VERIFICATION_CODE = "1111"  


class _PhoneValidatorMixin:
    """Shared phone‑number validation."""

    @staticmethod
    def _validate_phone(value: str) -> str:
        if len(value) != 11 or not value.isdigit():
            raise serializers.ValidationError("شماره تلفن باید 11 رقم عددی باشد")
        return value

class SellersSendActivationCodeSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=11)

    def validate_phone_number(self, value):
        return _PhoneValidatorMixin._validate_phone(value)

    def save(self):
        phone_number = self.validated_data["phone_number"]
        user_exists = User.objects.filter(phone_number=phone_number).exists()

        print(f"[DEBUG] Activation code for {phone_number}: {STATIC_VERIFICATION_CODE}")

        return {
            "phone_number": phone_number,
            "user_exists": user_exists,
        }

class SellersVerifyActivationCodeSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=11)
    activation_code = serializers.CharField(max_length=4)

    def validate_phone_number(self, value):
        return _PhoneValidatorMixin._validate_phone(value)

    def validate_activation_code(self, value):
        if value != STATIC_VERIFICATION_CODE:
            raise serializers.ValidationError("کد فعالسازی نامعتبر است")
        return value

    def save(self):
        phone_number = self.validated_data["phone_number"]
        user, created = User.objects.get_or_create(phone_number=phone_number)
        return {
            "user": user,
            "is_new_user": created,
        }

class SellersUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ("phone_number", "is_active", "date_joined")

class SellersAddCriticalInformationSerializer(serializers.Serializer):
    is_legal = serializers.BooleanField(default=True)  # فروشنده حقوقی
    national_code = serializers.CharField(max_length=10,required=True)
    shaba_number = serializers.CharField(max_length=26 ,required=True)
    store_name = serializers.CharField(max_length=25 ,required=True)
    store_address = serializers.CharField(required=True)

        
    def save(self):
        user = self.context['request'].user  
        
        seller, created = Seller.objects.get_or_create(
            user=user,
            defaults={
                'is_legal': self.validated_data['is_legal'],
                'national_code': self.validated_data['national_code'],
                'shaba_number': self.validated_data['shaba_number'],
                'store_name': self.validated_data['store_name'],
                'store_address': self.validated_data['store_address'],
                'verification_status': 'pending'
            }
        )
        
        if not created:
            for attr in ['is_legal', 'national_code', 'shaba_number', 'store_name', 'store_address']:
                setattr(seller, attr, self.validated_data[attr])
            seller.save()
        return {
            "user": user,
            "is_new_user": created,
        }
