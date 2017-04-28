from django.conf import settings
from django.contrib.auth import get_user_model, login
from django.template.response import TemplateResponse
from django.views.decorators.csrf import csrf_exempt
from oauth2client import client, crypt
from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response


@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def verify_google_token(request):
    token = request.data.get('token')
    if token is None:
        raise ValidationError({'detail': 'Auth token required.'})
    try:
        idinfo = client.verify_id_token(token, settings.GOOGLE_AUTH_KEY)
        if idinfo['iss'] not in ['accounts.google.com',
                                 'https://accounts.google.com']:
            raise crypt.AppIdentityError('Wrong issuer.')
        if idinfo.get('hd') != settings.GOOGLE_AUTH_HOSTED_DOMAIN:
            raise crypt.AppIdentityError('Wrong hosted domain.')
    except crypt.AppIdentityError as e:
        raise AuthenticationFailed(e)
    defaults = {
        'email': idinfo['email'],
        'first_name': idinfo.get('given_name', ''),
        'last_name': idinfo.get('family_name', ''),
    }
    user, created = get_user_model().objects.get_or_create(
        username=idinfo['email'], defaults=defaults)
    user.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, user)
    return Response({})


def login_view(request):
    return TemplateResponse(
        request,
        template='viewer/login.html',
        context={'next': request.GET.get('next', '/')})
