from .models import Profile,CustomUser
from rest_framework.exceptions import NotFound

def get_profile(user:CustomUser) -> Profile:
    profile , _ = Profile.objects.get_or_create(user=user)
    return profile