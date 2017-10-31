from django.contrib.auth.models import User
from rest_framework.reverse import reverse

from viewer.api import factories

from . import DataTestCase


class TestExperiments(DataTestCase):

    def setUp(self):
        User.objects.create_user(username='testuser',
                                 email='example@mozilla.com',
                                 password='password')
        self.client.login(username='testuser', password='password')
        self.url = reverse('v2-experiments')

    def test_basic(self):
        response = self.client.get(self.url)
        expected = {
            'experiments': [
                {
                    'id': self.dataset.id,
                    'name': self.dataset.name,
                    'completed': True,
                },
                {
                    'id': self.dataset_older.id,
                    'name': self.dataset_older.name,
                    'completed': True,
                },
            ]
        }
        self.assertEqual(response.json(), expected)

    def test_null_ordering(self):
        # Sometimes the `created_at` field can be NULL.
        self.dataset.created_at = None
        self.dataset.save()

        response = self.client.get(self.url)
        data = response.json()
        self.assertEqual(len(data['experiments']), 2)
        self.assertEqual(data['experiments'][0]['id'], self.dataset_older.id)

    def test_display(self):
        # Test that a newer experiment with display=False isn't returned.
        factories.DataSetFactory(display=False)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['experiments']), 2)
        self.assertEqual(data['experiments'][0]['id'], self.dataset.id)
        self.assertEqual(data['experiments'][1]['id'], self.dataset_older.id)


class TestExperimentById(DataTestCase):

    def setUp(self):
        User.objects.create_user(username='testuser',
                                 email='example@mozilla.com',
                                 password='password')
        self.client.login(username='testuser', password='password')
        self.url = reverse('v2-experiment-by-id', args=[self.dataset.id])

    def test_basic(self):
        response = self.client.get(self.url)
        expected = {
            'id': self.dataset.id,
            'name': self.dataset.name,
            'description': '',  # TODO
            'authors': [],  # TODO
            'populations': self.dataset.get_populations(),
            'subgroups': self.dataset.get_subgroups(),
            'metrics': self.dataset.get_metrics(),
        }
        self.assertEqual(response.json(), expected)

    def test_404(self):
        response = self.client.get(reverse('v2-experiment-by-id', args=[99]))
        assert response.status_code == 404

    def test_display(self):
        # Test that an experiment with display=False isn't returned.
        dataset = factories.DataSetFactory(display=False)
        response = self.client.get(reverse('v2-experiment-by-id',
                                           args=[dataset.id]))
        assert response.status_code == 404


class TestMetricById(DataTestCase):

    def setUp(self):
        User.objects.create_user(username='testuser',
                                 email='example@mozilla.com',
                                 password='password')
        self.client.login(username='testuser', password='password')
        self.url = reverse('v2-metric-by-id',
                           args=[self.dataset.id, self.flag_metric.id])

    def test_basic(self):
        response = self.client.get(self.url)
        expected = {
            'id': self.flag_metric.id,
            'name': self.flag_metric.name,
            'description': self.flag_metric.description,
            'type': self.flag_metric.type,
            'units': {'x': self.flag_metric.units},
            'populations': [{
                'name': 'chaos',
                'n': 12345,
                'data': [
                    {'x': '1', 'y': 0.9, 'count': 12600},
                    {'x': '10', 'y': 0.07, 'count': 980},
                    {'x': '100', 'y': 0.03, 'count': 420},
                ]
            }, {
                'name': 'control',
                'n': 12345,
                'data': [
                    {'x': '1', 'y': 0.9, 'count': 12600},
                    {'x': '10', 'y': 0.07, 'count': 980},
                    {'x': '100', 'y': 0.03, 'count': 420},
                ]
            }]
        }
        self.assertEqual(response.json(), expected)
