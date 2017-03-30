from django.conf import settings


def google_auth_key(request):
    return {'GOOGLE_AUTH_KEY': settings.GOOGLE_AUTH_KEY}
