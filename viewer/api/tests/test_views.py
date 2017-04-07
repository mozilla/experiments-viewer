import json

from django.contrib.auth import get_user
from django.contrib.auth.models import User
from django.test import TestCase

from mock import patch
from oauth2client import client
from rest_framework.reverse import reverse

from viewer.api import factories
from viewer.api.models import CategoryCollection, DataSet


class DataTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        # This will create 3 datasets (1 of which being hidden) with 2
        # populations of 1 metric each.

        def create_collections(dataset, population, cat_metric, num_metric):
            kwargs = {'dataset': dataset}
            if population:
                kwargs['population'] = population

            cat_collection = factories.CategoryCollectionFactory(
                metric=cat_metric, **kwargs)
            factories.CategoryPointFactory.create_batch(
                3, collection=cat_collection)

            num_collection = factories.NumericCollectionFactory(
                metric=num_metric, **kwargs)
            factories.NumericPointFactory.create_batch(
                3, collection=num_collection)

        cat_metric = factories.CategoryMetricFactory()
        num_metric = factories.NumericMetricFactory()

        # Create 2 viewable datasets.
        dataset_older = factories.DataSetFactory()
        create_collections(dataset_older, 'control', cat_metric, num_metric)
        create_collections(dataset_older, None, cat_metric, num_metric)

        dataset = factories.DataSetFactory()
        create_collections(dataset, 'control', cat_metric, num_metric)
        create_collections(dataset, None, cat_metric, num_metric)

        # Create 1 non-viewable dataset.
        dataset_hidden = factories.DataSetFactory(display=False)
        create_collections(dataset_hidden, 'control', cat_metric, num_metric)
        create_collections(dataset_hidden, None, cat_metric, num_metric)

        # Save these for use in tests.
        cls.dataset = dataset
        cls.dataset_older = dataset_older
        cls.dataset_hidden = dataset_hidden
        cls.cat_metric = cat_metric
        cls.num_metric = num_metric


class TestDataSet(DataTestCase):

    def setUp(self):
        User.objects.create_user(username='testuser',
                                 email='example@mozilla.com',
                                 password='password')
        self.client.login(username='testuser', password='password')

    def test_basic(self):
        url = reverse('datasets')
        response = self.client.get(url)
        expected = {
            'datasets': [
                {
                    'id': self.dataset.id,
                    'name': self.dataset.name,
                },
                {
                    'id': self.dataset_older.id,
                    'name': self.dataset_older.name,
                },
            ]
        }
        self.assertEqual(response.json(), expected)


class TestMetric(DataTestCase):

    def setUp(self):
        User.objects.create_user(username='testuser',
                                 email='example@mozilla.com',
                                 password='password')
        self.client.login(username='testuser', password='password')

    def test_basic(self):
        """
        Test both a numerical and categorical metric for JSON format and data.
        """
        # No `ds` query string gets latest data set.
        url = reverse('metric', args=[self.cat_metric.id])
        response = self.client.get(url)
        expected = {
            u'name': self.cat_metric.name,
            u'id': self.cat_metric.id,
            u'type': u'categorical',
            u'description': self.cat_metric.description,
            u'dataSet': self.dataset.name,
            u'populations': [
                {
                    u'name': u'control',
                    u'numObs': 12345,
                    u'points': [
                        {u'p': 0.9, u'c': 0.9, u'b': u'x86', u'refRank': 1},
                        {u'p': 0.07, u'c': 0.97, u'b': u'arm', u'refRank': 2},
                        {u'p': 0.03, u'c': 1.0, u'b': u'ppc', u'refRank': 3}
                    ],
                }
            ]
        }
        self.assertEqual(response.json(), expected)

        url = reverse('metric', args=[self.num_metric.id])
        response = self.client.get(url)
        expected = {
            u'name': self.num_metric.name,
            u'id': self.num_metric.id,
            u'type': u'numerical',
            u'description': self.num_metric.description,
            u'dataSet': self.dataset.name,
            u'populations': [
                {
                    u'numObs': 12345,
                    u'name': u'control',
                    u'points': [
                        {u'p': 0.9, u'c': 0.9, u'b': u'1.0'},
                        {u'p': 0.07, u'c': 0.97, u'b': u'10.0'},
                        {u'p': 0.03, u'c': 1.0, u'b': u'100.0'}
                    ],
                }
            ]
        }
        self.assertEqual(response.json(), expected)

    def test_specific_experiment(self):
        # Test that passing ?ds= works.
        response = self.client.get(
            reverse('metric', args=[self.cat_metric.id]),
            data={'ds': self.dataset_older.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(DataSet.objects.visible().count(), 2)
        self.assertEqual(response.json()['dataSet'], self.dataset_older.name)

    def test_display_dataset(self):
        # Test that a newer dataset with display=False isn't returned.
        factories.DataSetFactory(display=False)

        response = self.client.get(
            reverse('metric', args=[self.cat_metric.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['dataSet'], self.dataset.name)

    def test_date_with_no_data_404(self):
        # Testing dataset id=999 should find no dataset and return a 404.
        response = self.client.get(
            reverse('metric', args=[self.cat_metric.id]),
            data={'ds': '999'})
        self.assertEqual(response.status_code, 404)

    def test_no_metric_404(self):
        url = reverse('metric', args=['999'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_specific_population(self):
        # Test if we specify a population we only get that population.
        collection = (
            CategoryCollection.objects.filter(dataset=self.dataset)
                                      .exclude(population='control').first())
        response = self.client.get(
            reverse('metric', args=[self.num_metric.id]),
            data={'pop': collection.population})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        assert len(data['populations']) == 1
        self.assertEqual(data['populations'][0]['name'], collection.population)

    def test_multiple_populations(self):
        # Test if we specify a population we only get that population.
        collection = (
            CategoryCollection.objects.filter(dataset=self.dataset)
                                      .exclude(population='control').first())
        response = self.client.get(
            reverse('metric', args=[self.num_metric.id]),
            data={'pop': ','.join([collection.population, 'control'])})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        assert len(data['populations']) == 2
        self.assertItemsEqual([p['name'] for p in data['populations']],
                              [collection.population, 'control'])


class TestMetrics(DataTestCase):

    def setUp(self):
        self.url = reverse('metrics')
        User.objects.create_user(username='testuser',
                                 email='example@mozilla.com',
                                 password='password')
        self.client.login(username='testuser', password='password')

    def test_basic(self):
        response = self.client.get(self.url)
        expected = {
            u'metrics': [{
                u'id': self.cat_metric.id,
                u'name': self.cat_metric.name,
                u'description': self.cat_metric.description,
                u'tooltip': self.cat_metric.tooltip,
                u'type': u'categorical',
            }, {
                u'id': self.num_metric.id,
                u'name': self.num_metric.name,
                u'description': self.num_metric.description,
                u'tooltip': self.num_metric.tooltip,
                u'type': u'numerical',
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
