from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from accounts.views import CustomTokenObtainPairView, RegisterApiView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('', SpectacularSwaggerView.as_view(url_name='schema'), name='root-swagger'),
    path('api/', include([
        path('jwt/', include([
            path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
            path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        ])),
        path('auth/', include([
            path('register/', RegisterApiView.as_view(), name='auth-register'),
        ])),
        path('accounts/', include('accounts.urls')), 
        path('sellers/', include('sellers.urls')),   
        path('products/', include('products.urls')),
        path('orders/', include('orders.urls'))
        # path('orders/', include('orders.urls')),
        # path('cart/', include('cart.urls')),
    ])),
    
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)