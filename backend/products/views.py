import random
from django.db import transaction
from django.db.models import Q, Min, Max, Count
from django.db import models
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import status, serializers
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from .models import Category, Product, ProductBase, ProductImage, ProductVariant
from .serializers import CategorySerializer
import random


class SellerProductCreateView(APIView):
    """
    Create a completely new product (both base product and seller offer)
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        seller = request.user.seller
        
        try:
            with transaction.atomic():
                category_id = request.data.get('category_id')
                category = get_object_or_404(Category, id=category_id)  
                base_attributes = {}
                if request.data.get('brand'):
                    base_attributes['brand'] = request.data['brand']
                if request.data.get('model'):
                    base_attributes['model'] = request.data['model']
                if request.data.get('weight'):
                    base_attributes['weight'] = str(request.data['weight'])
                if request.data.get('dimensions'):
                    import json
                    dimensions = request.data.get('dimensions')
                    if isinstance(dimensions, str):
                        base_attributes['dimensions'] = json.loads(dimensions)
                    else:
                        base_attributes['dimensions'] = dimensions
                
                if request.data.get('attributes'):
                    import json
                    attributes = request.data.get('attributes')
                    if isinstance(attributes, str):
                        base_attributes.update(json.loads(attributes))
                    else:
                        base_attributes.update(attributes)

                base_product = ProductBase.objects.create(
                    name=request.data.get('name'),
                    description=request.data.get('description', ''),
                    category=category,
                    attributes=base_attributes
                )

                product = Product.objects.create(
                    seller=seller,
                    base_product=base_product,
                    name=request.data.get('name'),
                    description=request.data.get('description', ''),
                    price=float(request.data.get('price')),
                    stock=int(request.data.get('stock'))
                )

                images = request.FILES.getlist('images')
                for index, image in enumerate(images):
                    is_featured_key = f'images[{index}].is_featured'
                    is_featured = request.data.get(is_featured_key, 'false').lower() == 'true'
                    alt_text_key = f'images[{index}].alt_text'
                    alt_text = request.data.get(alt_text_key, request.data.get('name'))
                    
                    ProductImage.objects.create(
                        product=product,
                        image=image,
                        alt_text=alt_text,
                        is_featured=is_featured
                    )

                variant_index = 0
                while f'variants[{variant_index}].attributes' in request.data:
                    import json
                    variant_attrs = request.data.get(f'variants[{variant_index}].attributes')
                    if isinstance(variant_attrs, str):
                        variant_attrs = json.loads(variant_attrs)
                    
                    ProductVariant.objects.create(
                        product=product,
                        attributes=variant_attrs
                    )
                    variant_index += 1

                return Response({
                    'id': product.id,
                    'message': 'محصول با موفقیت ایجاد شد',
                    'name': product.name,
                    'price': float(product.price),
                    'stock': product.stock
                }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            import traceback
            print(f"Error creating product: {str(e)}")
            print(traceback.format_exc())
            return Response(
                {"detail": f"خطا در ایجاد محصول: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

class ProductSearchView(APIView):
    """
    Search for existing products that other sellers have created
    """
    permission_classes = [IsAuthenticated]
    
    class ProductSearchOutputSerializer(serializers.ModelSerializer):
        sellers_count = serializers.SerializerMethodField()
        min_price = serializers.SerializerMethodField()
        max_price = serializers.SerializerMethodField()
        images = serializers.SerializerMethodField()
        category_name = serializers.CharField(source='category.name', read_only=True)
        
        class Meta:
            model = ProductBase
            fields = [
                'id', 'name', 'description', 'category_name', 
                'sellers_count', 'min_price', 'max_price', 'images'
            ]
        
        def get_sellers_count(self, obj):
            return obj.seller_products.count()
        
        def get_min_price(self, obj):
            min_price = obj.seller_products.aggregate(Min('price'))['price__min']
            return float(min_price) if min_price else None
        
        def get_max_price(self, obj):
            max_price = obj.seller_products.aggregate(Max('price'))['price__max']
            return float(max_price) if max_price else None
        
        def get_images(self, obj):
            request = self.context.get('request')
            base_images = obj.images.all()[:1]
            if base_images:
                if request:
                    return [request.build_absolute_uri(base_images[0].image.url)]
                return [base_images[0].image.url]
            
            first_seller_product = obj.seller_products.first()
            if first_seller_product and first_seller_product.images.exists():
                image = first_seller_product.images.first()
                if request:
                    return [request.build_absolute_uri(image.image.url)]
                return [image.image.url]
            
            return []
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='q', 
                description='Search query', 
                required=False, 
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name='category', 
                description='Category ID', 
                required=False, 
                type=OpenApiTypes.INT
            ),
        ],
        responses=ProductSearchOutputSerializer(many=True)
    )
    def get(self, request):
        query = request.GET.get('q', '')
        category_id = request.GET.get('category')
        
        queryset = ProductBase.objects.annotate(
            sellers_count=Count('seller_products')
        ).filter(sellers_count__gt=0)
        
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query) |
                Q(attributes__icontains=query)
            )
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        queryset = queryset.order_by('-sellers_count', '-created_at')[:20]
        
        serializer = self.ProductSearchOutputSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

class SellerOfferCreateView(APIView):
    """
    Create a seller offer for an existing product
    """
    permission_classes = [IsAuthenticated]
    
    class SellerOfferInputSerializer(serializers.Serializer):
        product_base_id = serializers.IntegerField()
        price = serializers.DecimalField(max_digits=12, decimal_places=2)
        discount_price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
        stock = serializers.IntegerField(min_value=0)
        condition = serializers.ChoiceField(choices=['new', 'used', 'refurbished'], default='new')
        warranty = serializers.IntegerField(required=False, allow_null=True, help_text="Warranty in months")
        description = serializers.CharField(required=False, allow_blank=True)
        shipping_time = serializers.ChoiceField(
            choices=['1-3', '3-7', '7-14', '14+'], 
            default='1-3'
        )
    
    class SellerOfferOutputSerializer(serializers.ModelSerializer):
        product_name = serializers.CharField(source='base_product.name', read_only=True)
        
        class Meta:
            model = Product
            fields = [
                'id', 'product_name', 'price', 'stock', 
                'created_at', 'updated_at'
            ]
    
    @extend_schema(
        request=SellerOfferInputSerializer,
        responses=SellerOfferOutputSerializer
    )
    def post(self, request):
        serializer = self.SellerOfferInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        seller = request.user.seller
        
        try:
            with transaction.atomic():
                base_product = get_object_or_404(ProductBase, id=data['product_base_id'])
                existing_product = Product.objects.filter(
                    seller=seller,
                    base_product=base_product
                ).first()
                
                if existing_product:
                    return Response(
                        {"detail": "شما قبلاً برای این محصول پیشنهاد ثبت کرده‌اید"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                product = Product.objects.create(
                    seller=seller,
                    base_product=base_product,
                    name=base_product.name,
                    description=data.get('description', base_product.description),
                    price=data['price'],
                    stock=data['stock']
                )
                
                return Response(
                    self.SellerOfferOutputSerializer(product).data,
                    status=status.HTTP_201_CREATED
                )
                
        except Exception as e:
            return Response(
                {"detail": f"خطا در ثبت پیشنهاد: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

class CategoryListView(APIView):
    """
    Get list of categories for dropdown
    """
    permission_classes = [IsAuthenticated]
    
    @extend_schema(responses=CategorySerializer(many=True))
    def get(self, request):
        categories = Category.objects.filter(parent__isnull=True)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class SellerProductListView(APIView):
    """
    Get seller's own products (both created and offers)
    """
    permission_classes = [IsAuthenticated]
    
    class SellerProductOutputSerializer(serializers.ModelSerializer):
        product_type = serializers.SerializerMethodField()
        base_product_name = serializers.CharField(source='base_product.name', read_only=True)
        category_name = serializers.CharField(source='base_product.category.name', read_only=True)
        main_image = serializers.SerializerMethodField()
        
        class Meta:
            model = Product
            fields = [
                'id', 'name', 'base_product_name', 'category_name',
                'price', 'stock', 'product_type', 'main_image',
                'created_at', 'updated_at'
            ]
        
        def get_product_type(self, obj):
            base_creator = obj.base_product.seller_products.order_by('created_at').first()
            if base_creator and base_creator.seller == obj.seller:
                return 'created'
            return 'offer'
        
        def get_main_image(self, obj):
            request = self.context.get('request')
            main_image = obj.images.filter(is_featured=True).first()
            if not main_image:
                main_image = obj.images.first()
            
            if main_image:
                if request:
                    return request.build_absolute_uri(main_image.image.url)
                return main_image.image.url
            if obj.base_product:
                base_image = obj.base_product.images.first()
                if base_image:
                    if request:
                        return request.build_absolute_uri(base_image.image.url)
                    return base_image.image.url
            
            return None
    
    @extend_schema(responses=SellerProductOutputSerializer(many=True))
    def get(self, request):
        products = Product.objects.filter(
            seller=request.user.seller
        ).select_related(
            'base_product', 
            'base_product__category'
        ).prefetch_related('images').order_by('-created_at')
        
        serializer = self.SellerProductOutputSerializer(
            products, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)

class SellerProductDetailView(APIView):
    """
    Get, update, or delete a specific seller product
    """
    permission_classes = [IsAuthenticated]
    
    class SellerProductDetailSerializer(serializers.ModelSerializer):
        images = serializers.SerializerMethodField()
        variants = serializers.SerializerMethodField()
        category_name = serializers.CharField(source='base_product.category.name', read_only=True)
        
        class Meta:
            model = Product
            fields = [
                'id', 'name', 'description', 'price', 'stock',
                'category_name', 'images', 'variants',
                'created_at', 'updated_at'
            ]
        
        def get_images(self, obj):
            request = self.context.get('request')
            return [
                {
                    'id': img.id,
                    'url': request.build_absolute_uri(img.image.url) if request else img.image.url,
                    'alt_text': img.alt_text,
                    'is_featured': img.is_featured
                }
                for img in obj.images.all()
            ]
        
        def get_variants(self, obj):
            return [
                {
                    'id': variant.id,
                    'attributes': variant.attributes
                }
                for variant in obj.variants.all()
            ]
    
    def get_object(self, pk, seller):
        try:
            return Product.objects.get(pk=pk, seller=seller)
        except Product.DoesNotExist:
            return None
    
    @extend_schema(responses=SellerProductDetailSerializer)
    def get(self, request, pk):
        product = self.get_object(pk, request.user.seller)
        if not product:
            return Response(
                {"detail": "محصول پیدا نشد."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.SellerProductDetailSerializer(product, context={'request': request})
        return Response(serializer.data)
    
    class ProductUpdateSerializer(serializers.Serializer):
        price = serializers.DecimalField(max_digits=12, decimal_places=2, required=False)
        stock = serializers.IntegerField(required=False)
        description = serializers.CharField(required=False)
    
    @extend_schema(
        request=ProductUpdateSerializer,
        responses=SellerProductDetailSerializer
    )
    def put(self, request, pk):
        product = self.get_object(pk, request.user.seller)
        if not product:
            return Response(
                {"detail": "محصول پیدا نشد."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = self.ProductUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Update allowed fields
        for field, value in serializer.validated_data.items():
            setattr(product, field, value)
        
        product.save()
        
        response_serializer = self.SellerProductDetailSerializer(product, context={'request': request})
        return Response(response_serializer.data)
    
    @extend_schema(responses={"204": "No Content"})
    def delete(self, request, pk):
        product = self.get_object(pk, request.user.seller)
        if not product:
            return Response(
                {"detail": "محصول پیدا نشد."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProductStatsView(APIView):
    """
    Get statistics about seller's products
    """
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        responses={
            200: {
                "type": "object",
                "properties": {
                    "total_products": {"type": "integer"},
                    "total_stock": {"type": "integer"},
                    "products_created": {"type": "integer"},
                    "products_offers": {"type": "integer"},
                    "out_of_stock": {"type": "integer"},
                    "low_stock": {"type": "integer"},
                    "products_with_discount": {"type": "integer"},
                }
            }
        }
    )
    def get(self, request):
        seller = request.user.seller
        products = Product.objects.filter(seller=seller)
        
        # Calculate statistics
        total_products = products.count()
        total_stock = products.aggregate(total=models.Sum('stock'))['total'] or 0
        out_of_stock = products.filter(stock=0).count()
        low_stock = products.filter(stock__lte=10, stock__gt=0).count()
        
        products_created = 0
        products_offers = 0
        products_with_discount = 0
        
        for product in products:
            base_creator = product.base_product.seller_products.order_by('created_at').first()
            if base_creator and base_creator.seller == seller:
                products_created += 1
            else:
                products_offers += 1
            
        return Response({
            "total_products": total_products,
            "total_stock": total_stock,
            "products_created": products_created,
            "products_offers": products_offers,
            "out_of_stock": out_of_stock,
            "low_stock": low_stock,
            "products_with_discount": products_with_discount,
        })
              
class PublicProductListView(APIView):
    """
    Public endpoint to list all products (no authentication required)
    """
    permission_classes = [AllowAny]
    
    class PublicProductSerializer(serializers.ModelSerializer):
        main_image = serializers.SerializerMethodField()
        category_name = serializers.CharField(source='base_product.category.name', read_only=True)
        seller_name = serializers.CharField(source='seller.store_name', read_only=True)
        discount_price = serializers.SerializerMethodField()
        
        class Meta:
            model = Product
            fields = [
                'id', 'name', 'price', 'stock', 
                'main_image', 'category_name', 'seller_name',
                'discount_price', 'created_at'
            ]
        
        def get_main_image(self, obj):
            request = self.context.get('request')
            main_image = obj.images.filter(is_featured=True).first()
            if not main_image:
                main_image = obj.images.first()
            
            if main_image:
                if request:
                    return request.build_absolute_uri(main_image.image.url)
                return main_image.image.url
            
            if obj.base_product:
                base_image = obj.base_product.images.first()
                if base_image:
                    if request:
                        return request.build_absolute_uri(base_image.image.url)
                    return base_image.image.url
            
            return None
        
        def get_discount_price(self, obj):
            if random.random() > 0.7: 
                return float(obj.price) * 0.85 
            return None
    
    def get(self, request):
        # Get query parameters
        category = request.GET.get('category')
        search = request.GET.get('search')
        sort = request.GET.get('sort', 'random')
        limit = int(request.GET.get('limit', 20))
        
        queryset = Product.objects.filter(stock__gt=0).select_related(
            'seller', 'base_product', 'base_product__category'
        ).prefetch_related('images')
        
        if category:
            queryset = queryset.filter(
                Q(base_product__category__en_name__iexact=category) |
                Q(base_product__category__name__icontains=category)
            )
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(base_product__name__icontains=search) |
                Q(base_product__description__icontains=search)
            )
        
        if sort == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'price_low':
            queryset = queryset.order_by('price')
        elif sort == 'price_high':
            queryset = queryset.order_by('-price')
        elif sort == 'popular':
            queryset = queryset.order_by('-stock')  # For now, use stock as proxy
        else:
            products_list = list(queryset[:limit * 2])
            random.shuffle(products_list)
            queryset = products_list[:limit]
            
            serializer = self.PublicProductSerializer(
                queryset, 
                many=True, 
                context={'request': request}
            )
            return Response(serializer.data)
        
        queryset = queryset[:limit]
        
        serializer = self.PublicProductSerializer(
            queryset, 
            many=True, 
            context={'request': request}
        )
        return Response(serializer.data)

class PublicProductDetailView(APIView):
    """
    Public endpoint to view product details (no authentication required)
    """
    permission_classes = [AllowAny]
    
    class PublicProductDetailSerializer(serializers.ModelSerializer):
        images = serializers.SerializerMethodField()
        category_name = serializers.CharField(source='base_product.category.name', read_only=True)
        seller_info = serializers.SerializerMethodField()
        attributes = serializers.JSONField(source='base_product.attributes', read_only=True)
        variants = serializers.SerializerMethodField()
        related_products = serializers.SerializerMethodField()
        
        class Meta:
            model = Product
            fields = [
                'id', 'name', 'description', 'price', 'stock',
                'images', 'category_name', 'seller_info', 'attributes',
                'variants', 'related_products', 'created_at'
            ]
        
        def get_images(self, obj):
            request = self.context.get('request')
            images = []
            
            for img in obj.images.all():
                images.append({
                    'url': request.build_absolute_uri(img.image.url) if request else img.image.url,
                    'alt_text': img.alt_text,
                    'is_featured': img.is_featured
                })
            
            if not images and obj.base_product:
                for img in obj.base_product.images.all():
                    images.append({
                        'url': request.build_absolute_uri(img.image.url) if request else img.image.url,
                        'alt_text': img.alt_text,
                        'is_featured': img.is_featured
                    })
            
            return images
        
        def get_seller_info(self, obj):
            return {
                'id': obj.seller.id,
                'name': obj.seller.store_name,
                'rating': 4.5, 
                'products_count': obj.seller.products.count()
            }
        
        def get_variants(self, obj):
            return [
                {
                    'id': variant.id,
                    'attributes': variant.attributes
                }
                for variant in obj.variants.all()
            ]
        
        def get_related_products(self, obj):
            related = Product.objects.filter(
                base_product__category=obj.base_product.category,
                stock__gt=0
            ).exclude(id=obj.id)[:4]
            
            request = self.context.get('request')
            return [
                {
                    'id': p.id,
                    'name': p.name,
                    'price': float(p.price),
                    'image': request.build_absolute_uri(p.images.first().image.url) 
                             if p.images.exists() and request else None
                }
                for p in related
            ]
    
    def get(self, request, pk):
        try:
            product = Product.objects.select_related(
                'seller', 'base_product', 'base_product__category'
            ).prefetch_related(
                'images', 'variants'
            ).get(pk=pk)
            
            serializer = self.PublicProductDetailSerializer(
                product, 
                context={'request': request}
            )
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response(
                {"detail": "محصول یافت نشد"},
                status=status.HTTP_404_NOT_FOUND
            )

class PublicCategoryListView(APIView):
    """
    Public endpoint to list categories
    """
    permission_classes = [AllowAny]
    def get(self, request):
        categories = Category.objects.filter(
            parent__isnull=True
        ).annotate(
            products_count=Count('products')
        ).filter(products_count__gt=0)[:20]
        
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)