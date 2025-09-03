from django.urls import path
from .views import (
    RegisterApiView,
    LoginApiView,
    CustomTokenObtainPairView,
    ProfileApiView,
    ProfileUpdateApiView,
    CheckUserRoleView,
    ChangePhoneNumberView,
    ChangePasswordView,
)

app_name = 'accounts'

urlpatterns = [
    path('register/', RegisterApiView.as_view(), name='register'),
    path('login/', LoginApiView.as_view(), name='login'),
    path('jwt/login/', CustomTokenObtainPairView.as_view(), name='jwt-login'),
    path('profile/', ProfileApiView.as_view(), name='profile'),
    path('profile/update/', ProfileUpdateApiView.as_view(), name='profile-update'),
    path('check-role/', CheckUserRoleView.as_view(), name='check-role'),
    path('change-phone/', ChangePhoneNumberView.as_view(), name='change-phone'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]

