from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Seller,SellerProfile
from drf_spectacular.utils import extend_schema, extend_schema_field
from .permissions import IsSellerPermission, IsAuthenticatedOrSellerRegister

class SellerRegisterApiView(APIView):
    """
    Seller registration - converts authenticated user to seller
    """
    permission_classes = [IsAuthenticatedOrSellerRegister]
    
    class InputSellerRegisterSerializer(serializers.Serializer):
        is_legal = serializers.BooleanField()
        national_code = serializers.CharField()
        shaba_number = serializers.CharField()
        store_name = serializers.CharField(max_length=255)
        store_address = serializers.CharField(min_length=10)
        
        def validate_national_code(self, value):
            if len(value) != 10:
                raise serializers.ValidationError("کد ملی باید 10 رقم باشد")
            return value
        
        def validate_shaba_number(self, value):
            value = value.replace('-', '').replace(' ', '')
            if len(value) != 24:
                raise serializers.ValidationError("شماره شبا باید 24 رقم باشد")
            return value
    
    class OutputSellerRegisterSerializer(serializers.ModelSerializer):
        user_phone_number = serializers.SerializerMethodField()

        class Meta:
            model = Seller
            fields = ('user_phone_number', 'is_legal', 'national_code', 
                     'shaba_number', 'store_name', 'store_address', 'created_at')
        
        @extend_schema_field(serializers.CharField())
        def get_user_phone_number(self, obj):
            return obj.user.phone_number
        
    @extend_schema(request=InputSellerRegisterSerializer, responses=OutputSellerRegisterSerializer)
    def post(self, request):
        serializer = self.InputSellerRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.role = 'seller'
        user.save()

        seller, created = Seller.objects.get_or_create(user=user)

        seller.is_legal = serializer.validated_data['is_legal']
        seller.national_code = serializer.validated_data['national_code']
        seller.shaba_number = serializer.validated_data['shaba_number']
        seller.store_name = serializer.validated_data['store_name']
        seller.store_address = serializer.validated_data['store_address']
        seller.save()
        
        return Response(
            self.OutputSellerRegisterSerializer(seller, context={'request': request}).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

class SellerProfileUpdateView(APIView):
    """
    Update seller profile information
    """
    permission_classes = [IsSellerPermission]
    
    class SellerProfileUpdateInputSerializer(serializers.Serializer):
        store_name = serializers.CharField(max_length=255, required=False)
        store_address = serializers.CharField(required=False)
        shaba_number = serializers.CharField(max_length=26, required=False)
        national_code = serializers.CharField(max_length=10, required=False)
        is_legal = serializers.BooleanField(required=False)
        ceo_full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
        profile_image = serializers.ImageField(required=False, allow_null=True)
        
        def validate_shaba_number(self, value):
            if value:
                value = value.replace(' ', '').replace('-', '')
                if len(value) != 24:
                    raise serializers.ValidationError("شماره شبا باید 24 رقم باشد")
                if not value.startswith('IR'):
                    if len(value) == 22:
                        value = 'IR' + value
                    else:
                        raise serializers.ValidationError("فرمت شماره شبا صحیح نیست")
            return value
        
        def validate_national_code(self, value):
            if value:
                if len(value) != 10:
                    raise serializers.ValidationError("کد ملی باید 10 رقم باشد")
                if not value.isdigit():
                    raise serializers.ValidationError("کد ملی باید فقط شامل اعداد باشد")
            return value
    
    class SellerProfileUpdateOutputSerializer(serializers.ModelSerializer):
        user_phone_number = serializers.SerializerMethodField()
        ceo_full_name = serializers.SerializerMethodField()
        profile_image = serializers.SerializerMethodField()
        
        class Meta:
            model = Seller
            fields = [
                'user_phone_number', 'is_legal', 'national_code', 
                'shaba_number', 'store_name', 'store_address', 
                'ceo_full_name', 'profile_image', 'created_at'
            ]
        
        def get_user_phone_number(self, obj):
            return obj.user.phone_number
        
        def get_ceo_full_name(self, obj):
            return getattr(obj.profile, 'ceo_full_name', None) if hasattr(obj, 'profile') else None
        
        def get_profile_image(self, obj):
            if hasattr(obj, 'profile') and obj.profile.profile_image:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.profile.profile_image.url)
                return obj.profile.profile_image.url
            return None
    
    @extend_schema(
        request=SellerProfileUpdateInputSerializer,
        responses=SellerProfileUpdateOutputSerializer
    )
    def put(self, request):
        try:
            seller = request.user.seller
        except Seller.DoesNotExist:
            return Response(
                {"detail": "پروفایل فروشنده یافت نشد"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.SellerProfileUpdateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        validated_data = serializer.validated_data
        
        # Update Seller fields
        seller_fields = ['store_name', 'store_address', 'shaba_number', 'national_code', 'is_legal']
        for field in seller_fields:
            if field in validated_data:
                setattr(seller, field, validated_data[field])
        seller.save()
        
        # Update SellerProfile fields
        seller_profile, created = SellerProfile.objects.get_or_create(seller=seller)
        
        profile_fields = ['ceo_full_name', 'profile_image']
        for field in profile_fields:
            if field in validated_data:
                setattr(seller_profile, field, validated_data[field])
        seller_profile.save()
        
        return Response(
            self.SellerProfileUpdateOutputSerializer(
                seller, 
                context={'request': request}
            ).data,
            status=status.HTTP_200_OK
        )

# اگر view جداگانه برای GET هم می‌خواهید:
class SellerProfileDetailView(APIView):
    """
    Get seller profile information
    """
    permission_classes = [IsSellerPermission]
    
    class SellerProfileDetailSerializer(serializers.ModelSerializer):
        user_phone_number = serializers.SerializerMethodField()
        ceo_full_name = serializers.SerializerMethodField()
        profile_image = serializers.SerializerMethodField()
        
        class Meta:
            model = Seller
            fields = [
                'id', 'user_phone_number', 'is_legal', 'national_code', 
                'shaba_number', 'store_name', 'store_address', 
                'ceo_full_name', 'profile_image', 'created_at'
            ]
        
        def get_user_phone_number(self, obj):
            return obj.user.phone_number
        
        def get_ceo_full_name(self, obj):
            return getattr(obj.profile, 'ceo_full_name', None) if hasattr(obj, 'profile') else None
        
        def get_profile_image(self, obj):
            if hasattr(obj, 'profile') and obj.profile.profile_image:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.profile.profile_image.url)
                return obj.profile.profile_image.url
            return None
    
    @extend_schema(responses=SellerProfileDetailSerializer)
    def get(self, request):
        try:
            seller = request.user.seller
        except Seller.DoesNotExist:
            return Response(
                {"detail": "پروفایل فروشنده یافت نشد"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            self.SellerProfileDetailSerializer(
                seller, 
                context={'request': request}
            ).data
        )

class SellerApiView(APIView):
    """
    Get and update seller profile
    """
    permission_classes = [IsSellerPermission]
    
    class SellerViewOutputSerializer(serializers.ModelSerializer):
        user_phone_number = serializers.SerializerMethodField()

        class Meta:
            model = Seller
            fields = ("user_phone_number", "is_legal", "national_code", 
                     "shaba_number", "store_name", "store_address", "created_at")
        
        @extend_schema_field(serializers.CharField())
        def get_user_phone_number(self, obj):
            return obj.user.phone_number
    
    class SellerUpdateInputSerializer(serializers.Serializer):
        store_name = serializers.CharField(max_length=255, required=False)
        store_address = serializers.CharField(required=False)
        shaba_number = serializers.CharField(required=False)
        
        def validate_shaba_number(self, value):
            if value:
                value = value.replace('-', '').replace(' ', '')
                if len(value) != 24:
                    raise serializers.ValidationError("شماره شبا باید 24 رقم باشد")
            return value
    
    @extend_schema(responses=SellerViewOutputSerializer)
    def get(self, request):
        seller = Seller.objects.get(user=request.user)
        return Response(
            self.SellerViewOutputSerializer(seller, context={"request": request}).data
        )
    
    @extend_schema(request=SellerUpdateInputSerializer, responses=SellerViewOutputSerializer)
    def put(self, request):
        seller = Seller.objects.get(user=request.user)
        serializer = self.SellerUpdateInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
    
        for field, value in serializer.validated_data.items():
            setattr(seller, field, value)
        seller.save()
        
        return Response(
            self.SellerViewOutputSerializer(seller, context={"request": request}).data
        )

class SellerDashboardView(APIView):
    """
    Seller dashboard with statistics and recent activity
    """
    permission_classes = [IsSellerPermission]
    
    @extend_schema(
        responses={
            200: {
                "type": "object",
                "properties": {
                    "seller_info": {
                        "type": "object",
                        "properties": {
                            "store_name": {"type": "string"},
                            "total_products": {"type": "integer"},
                            "total_orders": {"type": "integer"},
                            "total_revenue": {"type": "number"},
                        }
                    },
                    "recent_products": {"type": "array"},
                    "recent_orders": {"type": "array"},
                }
            }
        }
    )
    def get(self, request):
        from products.models import Product
        
        seller = request.user.seller
        
        products = Product.objects.filter(seller=seller)
        total_products = products.count()
        
        
        dashboard_data = {
            "seller_info": {
                "store_name": seller.store_name,
                "total_products": total_products,
                "total_orders": 0, 
                "total_revenue": 0, 
            },
            "recent_products": [], 
            "recent_orders": [],  
        }
        
        return Response(dashboard_data)
            
class SellerStatusCheckView(APIView):
    """
    Check if authenticated user is a seller
    """
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        responses={
            200: {
                "type": "object",
                "properties": {
                    "is_seller": {"type": "boolean"},
                    "seller_info": {
                        "type": "object", 
                        "nullable": True,
                        "properties": {
                            "store_name": {"type": "string"},
                            "is_legal": {"type": "boolean"},
                        }
                    }
                }
            }
        }
    )
    def get(self, request):
        try:
            seller = Seller.objects.get(user=request.user)
            return Response({
                "is_seller": True,
                "seller_info": {
                    "store_name": seller.store_name,
                    "is_legal": seller.is_legal,
                }
            })
        except Seller.DoesNotExist:
            return Response({
                "is_seller": False,
                "seller_info": None
            })