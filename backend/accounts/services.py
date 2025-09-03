from django.db import transaction 
from .models import CustomUser, Profile


def create_profile(*, user:CustomUser) -> Profile:
    return Profile.objects.create(user=user)

def create_user(*, phone_number:str, password:str) -> CustomUser:
    return CustomUser.objects.create_user(phone_number=phone_number, password=password)

@transaction.atomic
def register(*, phone_number:str, password:str) -> CustomUser:

    user = create_user(phone_number=phone_number, password=password)
    # create_profile(user=user, phone_number=phone_number)

    return user