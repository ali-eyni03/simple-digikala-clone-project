from django.contrib.auth import get_user_model, authenticate
from django.core.validators import MinLengthValidator
from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema, extend_schema_field
from typing import Dict
from .models import CustomUser, Profile
from .selectors import get_profile
from .services import register
from .validators import (
    letter_validator,
    special_char_validator,
    number_validator,
    national_id_validator
)
try:
    from sellers.models import Seller, SellerProfile
except ImportError:
    Seller = None
    SellerProfile = None

User = get_user_model()

class RegisterApiView(APIView):
    """User Registration"""
    permission_classes = [AllowAny]
    
    class InputRegisterSerializer(serializers.Serializer):
        phone_number = serializers.CharField(max_length=255)
        password = serializers.CharField(
            validators=[
                MinLengthValidator(limit_value=10),
                letter_validator,
                special_char_validator,
                number_validator
            ]
        )
        confirm_password = serializers.CharField(max_length=255)
        
        def validate_phone_number(self, phone_number):
            if CustomUser.objects.filter(phone_number=phone_number).exists():
                raise serializers.ValidationError('شماره تلفن قبلا ثبت شده است')
            return phone_number
    
        def validate(self, data):
            if not data.get('password') or not data.get('confirm_password'):
                raise serializers.ValidationError("لطفا فیلد رمز عبور و تایید رمز عبور را وارد کنید")
            if data.get('password') != data.get('confirm_password'):
                raise serializers.ValidationError('فیلد تایید رمز عبور با فیلد رمز عبور برابر نیست')
            return data
    
    class OutPutRegisterSerializer(serializers.ModelSerializer):
        token = serializers.SerializerMethodField('get_token')
        
        class Meta:
            model = CustomUser
            fields = ('phone_number', 'token', 'created_at', 'updated_at')
            
        def get_token(self, user) -> Dict[str, str]:
            refresh = RefreshToken.for_user(user)
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
                  
    @extend_schema(request=InputRegisterSerializer, responses=OutPutRegisterSerializer)
    def post(self, request):
        serializer = self.InputRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = register(
                phone_number=serializer.validated_data.get("phone_number"),
                password=serializer.validated_data.get("password"),
            )
        except Exception as e:
            return Response(
                f'Database error: {e}',
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            self.OutPutRegisterSerializer(user, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

class LoginApiView(APIView):
    """User Login"""
    permission_classes = [AllowAny]
    
    class LoginInputSerializer(serializers.Serializer):
        phone_number = serializers.CharField()
        password = serializers.CharField()
    
    class LoginOutputSerializer(serializers.Serializer):
        refresh = serializers.CharField()
        access = serializers.CharField()
        phone_number = serializers.CharField()
    
    @extend_schema(request=LoginInputSerializer, responses=LoginOutputSerializer)
    def post(self, request):
        serializer = self.LoginInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone_number = serializer.validated_data['phone_number']
        password = serializer.validated_data['password']
        
        user = authenticate(request, phone_number=phone_number, password=password)
        
        if not user:
            return Response(
                {"detail": "رمز عبور یا شماره تلفن اشتباه است"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "phone_number": user.phone_number,
        }, status=status.HTTP_200_OK)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT serializer for phone number login"""
    username_field = 'phone_number'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField()
        self.fields['password'] = serializers.CharField()
    
    def validate(self, attrs):
        phone_number = attrs.get('phone_number')
        password = attrs.get('password')
        
        user = authenticate(
            request=self.context.get('request'),
            phone_number=phone_number,
            password=password
        )
        
        if user:
            refresh = self.get_token(user)
            data = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return data
        else:
            raise serializers.ValidationError('Invalid credentials')

class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT view for phone number login"""
    serializer_class = CustomTokenObtainPairSerializer

class ProfileApiView(APIView):
    """Get user profile"""
    permission_classes = [IsAuthenticated]
    
    class OutPutSerializer(serializers.ModelSerializer):
        phone_number = serializers.SerializerMethodField()
        
        class Meta:
            model = Profile
            fields = (
                'phone_number', 'first_name', 'last_name', 
                'national_id', 'birth_date', 'email', 
                'shaba_number', 'user_job'
            )
        
        @extend_schema_field(serializers.CharField())
        def get_phone_number(self, obj):
            return obj.user.phone_number
    
    @extend_schema(responses=OutPutSerializer)
    def get(self, request):
        query = get_profile(user=request.user)
        return Response(self.OutPutSerializer(query, context={"request": request}).data)

class ProfileUpdateApiView(APIView):
    """Update user profile"""
    permission_classes = [IsAuthenticated]
    
    class InputSerializer(serializers.Serializer):
        first_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
        last_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
        national_id = serializers.CharField(
            max_length=11, required=False, allow_blank=True, 
            validators=[national_id_validator]
        )
        birth_date = serializers.DateField(required=False, allow_null=True)
        email = serializers.EmailField(required=False, allow_blank=True)
        shaba_number = serializers.CharField(required=False, allow_blank=True)
        user_job = serializers.CharField(required=False, allow_blank=True)
    
    class OutputSerializer(serializers.ModelSerializer):
        phone_number = serializers.SerializerMethodField()
        
        class Meta:
            model = Profile
            fields = (
                'phone_number', 'first_name', 'last_name',
                'national_id', 'birth_date', 'email',
                'shaba_number', 'user_job'
            )
        
        @extend_schema_field(serializers.CharField())
        def get_phone_number(self, obj):
            return obj.user.phone_number
    
    @extend_schema(request=InputSerializer, responses=OutputSerializer)
    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        profile, _ = Profile.objects.get_or_create(user=request.user)
        
        for field, value in serializer.validated_data.items():
            setattr(profile, field, value)
        profile.save()
        
        return Response(
            self.OutputSerializer(profile, context={'request': request}).data,
            status=status.HTTP_200_OK
        )

class CheckUserRoleView(APIView):
    """Check if user has seller role"""
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        responses={
            200: {
                "type": "object",
                "properties": {
                    "is_seller": {"type": "boolean"},
                    "role": {"type": "string"},
                    "user_info": {"type": "object"},
                    "seller_info": {"type": "object"}
                }
            }
        }
    )
    def get(self, request):
        user = request.user
        try:
            from .models import Profile
            profile = Profile.objects.get(user=user)
        except:
            profile = None
        
        is_seller = False
        seller_info = None
        
        try:
            from sellers.models import Seller
            seller = Seller.objects.get(user=user)
            is_seller = True
            seller_info = {
                'store_name': seller.store_name,
                'is_legal': seller.is_legal,
                'created_at': seller.created_at.isoformat() if seller.created_at else None
            }
        except (Seller.DoesNotExist, ImportError):
            is_seller = False
        
        user_info = {
            'phone_number': user.phone_number,
            'full_name': f"{profile.first_name} {profile.last_name}" if profile and profile.first_name else None,
            'email': profile.email if profile else None,
        }
        
        return Response({
            'is_seller': is_seller,
            'role': 'seller' if is_seller else 'user',
            'user_info': user_info,
            'seller_info': seller_info
        })

class ChangePhoneNumberView(APIView):
    """Change user phone number"""
    permission_classes = [IsAuthenticated]
    
    class InputSerializer(serializers.Serializer):
        phone_number = serializers.CharField(max_length=15)
        
        def validate_phone_number(self, value):
            if User.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError("این شماره تلفن قبلا ثبت شده است")
            return value
    
    class OutputSerializer(serializers.Serializer):
        detail = serializers.CharField()
    
    @extend_schema(request=InputSerializer, responses=OutputSerializer)
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        request.user.phone_number = serializer.validated_data['phone_number']
        request.user.save()
        
        return Response(
            {"detail": "شماره تلفن با موفقیت بروزرسانی شد"},
            status=status.HTTP_200_OK
        )

class ChangePasswordView(APIView):
    """Change user password"""
    permission_classes = [IsAuthenticated]
    
    class InputSerializer(serializers.Serializer):
        old_password = serializers.CharField(required=True)
        new_password = serializers.CharField(required=True, min_length=6)
        
        def validate_new_password(self, value):
            if len(value) < 6:
                raise serializers.ValidationError("رمز عبور جدید باید حداقل ۶ کاراکتر باشد")
            return value
    
    class OutputSerializer(serializers.Serializer):
        detail = serializers.CharField()
    
    @extend_schema(request=InputSerializer, responses=OutputSerializer)
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']
        
        if not user.check_password(old_password):
            return Response(
                {"detail": "رمز عبور قبلی صحیح نیست"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        return Response(
            {"detail": "رمز عبور با موفقیت تغییر کرد"},
            status=status.HTTP_200_OK
        )