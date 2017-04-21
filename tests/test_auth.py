import json

from django.contrib.auth import get_user
from django.test import TestCase
from mock import patch
from oauth2client import client
from rest_framework.reverse import reverse


def fake_google_verify(token, key):
    return {'iss': 'accounts.google.com', 'hd': 'mozilla.com',
            'email': 'user@example.com'}


def bad_google_verify(token, key):
    return {'iss': 'accounts.elgoog.com', 'hd': 'mozilla.com',
            'email': 'user@example.com'}


def wrong_domain_google_verify(token, key):
    return {'iss': 'accounts.google.com', 'hd': 'gmail.com',
            'email': 'user@example.com'}


class TestLoginHandler(TestCase):

    def setUp(self):
        super(TestLoginHandler, self).setUp()
        self.url = reverse('verify_google_token')

    def post(self, data):
        return self.client.post(self.url, json.dumps(data),
                                content_type='application/json')

    @patch.object(client, 'verify_id_token', fake_google_verify)
    def test_login(self):
        res = self.post({'token': 'fake-token'})
        self.assertEqual(res.status_code, 200)
        user = get_user(self.client)
        assert user.is_authenticated()

    @patch.object(client, 'verify_id_token', bad_google_verify)
    def test_bad_login(self):
        res = self.post({'token': 'fake-token'})
        self.assertEqual(res.status_code, 403)
        user = get_user(self.client)
        assert not user.is_authenticated()

    @patch.object(client, 'verify_id_token', wrong_domain_google_verify)
    def test_wrong_domain_login(self):
        res = self.post({'token': 'fake-token'})
        self.assertEqual(res.status_code, 403)
        user = get_user(self.client)
        assert not user.is_authenticated()

    def test_login_nodata(self):
        res = self.post({})
        self.assertEqual(res.status_code, 400)
        user = get_user(self.client)
        assert not user.is_authenticated()
