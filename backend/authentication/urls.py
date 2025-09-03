from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView,TokenVerifyView


urlpatterns = [
    path('login/',TokenObtainPairView.as_view(), name='login'),
    path('register/',TokenRefreshView.as_view(), name='register'),
    path('verify/',TokenVerifyView.as_view(), name='verify'),
]
