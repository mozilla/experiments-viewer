import hashlib
import hmac
import os

from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import exceptions
from rest_framework.authentication import (BaseAuthentication,
                                           get_authorization_header)
from rest_framework.permissions import IsAuthenticated


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


class SharedSecretAuthentication(BaseAuthentication):

    def get_shared_secret(self, request):
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != 'moz-shared-secret':
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
        User = get_user_model()
        auth = self.get_shared_secret(request)
        if not auth:
            return None, None
        try:
            email, hm, unique_id = str(auth).split(',')
            consumer_id = hashlib.sha1(
                email + settings.SECRET_KEY).hexdigest()
            matches = hmac.new(unique_id + settings.SECRET_KEY,
                               consumer_id, hashlib.sha512).hexdigest() == hm
            if matches:
                try:
                    return User.objects.get(email=email), {'email': email}
                except User.DoesNotExist:
                    return None, None
        except Exception:
            return None, None

token_auth = SharedSecretAuthentication()


def commonplace_token(email):
    unique_id = os.urandom(8)

    consumer_id = hashlib.sha1(
        email + settings.SECRET_KEY).hexdigest()

    hm = hmac.new(
        unique_id + settings.SECRET_KEY,
        consumer_id, hashlib.sha512)

    return ','.join((email, hm.hexdigest(), unique_id))
