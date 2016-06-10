from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import exceptions
from rest_framework.authentication import (BaseAuthentication,
                                           get_authorization_header)
from rest_framework.permissions import IsAuthenticated

from oauth2client import client, crypt


class OptionsOrIsAuthenticated(IsAuthenticated):
    """
    This allows OPTIONS requests to pass without auth but falls back to the
    built-in ``rest_framework.permissions.IsAuthenticated``.
    """
    def has_permission(self, request, view):
        if request.method == 'OPTIONS':
            return True
        return super(OptionsOrIsAuthenticated, self).has_permission(request,
                                                                    view)


class GoogleJSONWebTokenAuthentication(BaseAuthentication):
    def get_jwt_value(self, request):
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != 'jwt':
            return None

        if len(auth) == 1:
            msg = 'Invalid Authorization header. No credentials provided.'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = ('Invalid Authorization header. Credentials string '
                   'should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)

        return auth[1]

    def authenticate(self, request):
        token = self.get_jwt_value(request)
        if token is None:
            return None, None
        try:
            idinfo = client.verify_id_token(token, settings.GOOGLE_AUTH_KEY)
            if idinfo['iss'] not in ['accounts.google.com',
                                     'https://accounts.google.com']:
                raise crypt.AppIdentityError("Wrong issuer.")
            if idinfo.get('hd') != settings.GOOGLE_AUTH_HOSTED_DOMAIN:
                raise crypt.AppIdentityError("Wrong hosted domain.")
        except crypt.AppIdentityError as e:
            raise exceptions.AuthenticationFailed(e)

        defaults = {
            'email': idinfo['email'],
            'first_name': idinfo['given_name'],
            'last_name': idinfo['family_name'],
        }
        user, created = get_user_model().objects.get_or_create(
            username=idinfo['email'], defaults=defaults,
        )
        return user, idinfo


google_auth = GoogleJSONWebTokenAuthentication()
