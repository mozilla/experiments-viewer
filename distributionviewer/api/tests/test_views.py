import datetime
import json
import os

from django.test import TestCase, override_settings
from mock import patch
from oauth2client import client
from rest_framework.reverse import reverse

from distributionviewer.api.models import (CategoryCollection, CategoryPoint,
                                           DataSet, Metric, NumericCollection,
                                           NumericPoint)


class TestMetric(TestCase):

    def create_data(self, date=None):
        cat_metric = Metric.objects.get_or_create(
            id=1, name='Architecture', description='Architecture descr',
            type='C', metadata={})[0]
        num_metric = Metric.objects.get_or_create(
            id=2, name='Searches Per Active Day', description='Searches descr',
            type='N', metadata={})[0]

        date = date or datetime.date(2016, 1, 1)
        dataset = DataSet.objects.create(date=date)

        cat_data = [
            ('x86', 0.95, 1),
            ('x86-64', 0.05, 2),
        ]
        cat_collection = CategoryCollection.objects.create(
            dataset=dataset, metric=cat_metric, num_observations=len(cat_data),
            population='channel_release')
        for bucket, proportion, rank in cat_data:
            CategoryPoint.objects.create(
                collection=cat_collection, bucket=bucket,
                proportion=proportion, rank=rank)

        num_data = [
            (0, 0.1),
            (1, 0.4),
            (5, 0.3),
            (10, 0.1),
        ]
        num_collection = NumericCollection.objects.create(
            dataset=dataset, metric=num_metric, num_observations=len(num_data),
            population='channel_release')
        for bucket, proportion in num_data:
            NumericPoint.objects.create(
                collection=num_collection, bucket=bucket,
                proportion=proportion)

    def test_basic(self):
        self.create_data()
        # No `date` query string gets latest data set.
        url = reverse('metric', args=['1'])
        response = self.client.get(url)
        expected = {
            u'numObs': 2,
            u'dataSet': u'2016-01-01',
            u'metric': u'Architecture',
            u'points': [
                {u'p': 0.95, u'c': 0.95, u'b': u'x86', u'refRank': 1},
                {u'p': 0.05, u'c': 1.0, u'b': u'x86-64', u'refRank': 2}
            ],
            u'type': u'category',
            u'description': u'Architecture descr'
        }
        self.assertEqual(response.json(), expected)

        url = reverse('metric', args=['2'])
        response = self.client.get(url)
        expected = {
            u'numObs': 4,
            u'dataSet': u'2016-01-01',
            u'metric': u'Searches Per Active Day',
            u'points': [
                {u'p': 0.1, u'c': 0.1, u'b': u'0.0'},
                {u'p': 0.4, u'c': 0.5, u'b': u'1.0'},
                {u'p': 0.3, u'c': 0.8, u'b': u'5.0'},
                {u'p': 0.1, u'c': 0.9, u'b': u'10.0'}
            ],
            u'type': u'numeric',
            u'description': u'Searches descr'
        }
        self.assertEqual(response.json(), expected)

    def test_specific_date(self):
        # Testing 20160205 should find the 20160202 dataset.
        self.create_data()
        self.create_data(date=datetime.date(2016, 2, 2))
        response = self.client.get(reverse('metric', args=['1']),
                                   data={'date': '2016-02-05'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(DataSet.objects.count(), 2)
        self.assertEqual(response.json()['dataSet'], u'2016-02-02')

    def test_invalid_date_400(self):
        self.create_data()
        response = self.client.get(reverse('metric', args=['1']),
                                   data={'date': '2000-99-99'})
        self.assertEqual(response.status_code, 400)

    def test_date_with_no_data_404(self):
        # Testing 20151231 should find no dataset and return a 404.
        self.create_data()
        response = self.client.get(reverse('metric', args=['1']),
                                   data={'date': '2015-12-31'})
        self.assertEqual(response.status_code, 404)

    def test_no_metric_404(self):
        url = reverse('metric', args=['1'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)


class TestMetrics(TestCase):

    def setUp(self):
        self.url = reverse('metrics')

    def create_data(self):
        Metric.objects.create(id=1, name='Architecture',
                              description='Architecture descr', metadata={})
        Metric.objects.create(id=2, name='Searches Per Active Day',
                              description='Searches descr', metadata={})

    def test_basic(self):
        self.create_data()
        response = self.client.get(self.url)
        expected = {
            u'metrics': [{
                u'id': 1,
                u'name': u'Architecture',
                u'description': u'Architecture descr',
            }, {
                u'id': 2,
                u'name': u'Searches Per Active Day',
                u'description': u'Searches descr',
            }]
        }
        self.assertEqual(response.json(), expected)


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
        self.url = reverse('login')

    def post(self, data):
        return self.client.post(self.url, json.dumps(data),
                                content_type='application/json')

    @patch.object(os, 'urandom', lambda n: '0' * n)
    @patch.object(client, 'verify_id_token', fake_google_verify)
    @override_settings(SECRET_KEY='random words')
    def test_login(self):
        res = self.post({'token': 'fake-token'})
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.content)
        self.assertEqual(
            data['token'],
            'user@example.com,76564683b0a59576155f6ad1d045c0ac74a63b71d9b9810c'
            '123eae6b50559096fb23dc42f554f13bed955b531e2369052be912da083dcf066'
            '6d9945bbad8db8b,00000000')

    @patch.object(client, 'verify_id_token', bad_google_verify)
    def test_bad_login(self):
        res = self.post({'token': 'fake-token'})
        self.assertEqual(res.status_code, 403)
        data = json.loads(res.content)
        self.assertEqual(data, {'detail': 'Wrong issuer.'})

    @patch.object(client, 'verify_id_token', wrong_domain_google_verify)
    def test_wrong_domain_login(self):
        res = self.post({'token': 'fake-token'})
        self.assertEqual(res.status_code, 403)
        data = json.loads(res.content)
        self.assertEqual(data, {'detail': 'Wrong hosted domain.'})

    def test_login_nodata(self):
        res = self.post({})
        self.assertEqual(res.status_code, 400)
        data = json.loads(res.content)
        self.assertEqual(data, {'detail': 'Auth token required.'})
