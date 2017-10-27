from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.reverse import reverse

from viewer.api import factories
from viewer.api.models import Collection, DataSet

from . import DataTestCase


class TestDataSet(DataTestCase):

    def setUp(self):
        User.objects.create_user(username='testuser',
                                 email='example@mozilla.com',
                                 password='password')
        self.client.login(username='testuser', password='password')
        self.url = reverse('datasets')

    def test_basic(self):
        response = self.client.get(self.url)
        expected = {
            'datasets': [
                {
                    'id': self.dataset.id,
                    'name': self.dataset.name,
                    'slug': self.dataset.slug,
                    'date': self.dataset.date.strftime('%Y-%m-%d'),
                    'metrics': self.dataset.get_metrics(),
                    'populations': self.dataset.get_populations(),
                    'subgroups': self.dataset.get_subgroups(),
                },
                {
                    'id': self.dataset_older.id,
                    'name': self.dataset_older.name,
                    'slug': self.dataset_older.slug,
                    'date': self.dataset_older.date.strftime('%Y-%m-%d'),
                    'metrics': self.dataset_older.get_metrics(),
                    'populations': self.dataset_older.get_populations(),
                    'subgroups': self.dataset.get_subgroups(),
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
        self.assertEqual(len(data['datasets']), 2)
        self.assertEqual(data['datasets'][0]['id'], self.dataset_older.id)


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
        url = reverse('metric', args=[self.flag_metric.id])
        response = self.client.get(url, data={'pop': 'control'})
        expected = {
            'name': self.flag_metric.name,
            'id': self.flag_metric.id,
            'type': 'FlagHistogram',
            'description': self.flag_metric.description,
            'dataSet': self.dataset.slug,
            'subgroup': 'All',
            'populations': [
                {
                    'name': 'control',
                    'numObs': 12345,
                    'points': [
                        {'p': 0.9, 'c': 12600, 'b': '1', 'refRank': 1},
                        {'p': 0.07, 'c': 980, 'b': '10', 'refRank': 2},
                        {'p': 0.03, 'c': 420, 'b': '100', 'refRank': 3}
                    ],
                }
            ]
        }
        self.assertEqual(response.json(), expected)

        url = reverse('metric', args=[self.count_metric.id])
        response = self.client.get(url, data={'pop': 'control'})
        expected = {
            'name': self.count_metric.name,
            'id': self.count_metric.id,
            'type': 'CountHistogram',
            'description': self.count_metric.description,
            'dataSet': self.dataset.slug,
            'subgroup': 'All',
            'populations': [
                {
                    'name': 'control',
                    'numObs': 12345,
                    'points': [
                        {'p': 0.9, 'c': 12600, 'b': '1', 'refRank': 1},
                        {'p': 0.07, 'c': 980, 'b': '10', 'refRank': 2},
                        {'p': 0.03, 'c': 420, 'b': '100', 'refRank': 3}
                    ],
                }
            ]
        }
        self.assertEqual(response.json(), expected)

    def test_null_ordering(self):
        # Sometimes the `created_at` field can be NULL.
        self.dataset.created_at = None
        self.dataset.save()

        url = reverse('metric', args=[self.flag_metric.id])
        response = self.client.get(url)
        self.assertEqual(response.json()['dataSet'], self.dataset_older.slug)

    def test_specific_experiment(self):
        # Test that passing ?ds= works.
        response = self.client.get(
            reverse('metric', args=[self.flag_metric.id]),
            data={'ds': self.dataset_older.slug})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(DataSet.objects.visible().count(), 2)
        self.assertEqual(response.json()['dataSet'], self.dataset_older.slug)

    def test_no_dataset_defaults_to_latest(self):
        response = self.client.get(
            reverse('metric', args=[self.flag_metric.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['dataSet'], self.dataset.slug)

    def test_display_dataset(self):
        # Test that a newer dataset with display=False isn't returned.
        factories.DataSetFactory(display=False)

        response = self.client.get(
            reverse('metric', args=[self.flag_metric.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['dataSet'], self.dataset.slug)

    def test_date_with_no_data_404(self):
        # Testing dataset id=999 should find no dataset and return a 404.
        response = self.client.get(
            reverse('metric', args=[self.flag_metric.id]),
            data={'ds': '999'})
        self.assertEqual(response.status_code, 404)

    def test_no_metric_404(self):
        url = reverse('metric', args=['999'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_metric_not_in_collection(self):
        metric = factories.MetricFactory()
        url = reverse('metric', args=[metric.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_specific_population(self):
        # Test if we specify a population we only get that population.
        collection = (
            Collection.objects.filter(dataset=self.dataset,
                                      metric=self.count_metric)
                              .exclude(population='control').first())
        response = self.client.get(
            reverse('metric', args=[self.count_metric.id]),
            data={'pop': collection.population})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        assert len(data['populations']) == 1
        self.assertEqual(data['populations'][0]['name'], collection.population)

    def test_multiple_populations(self):
        # Test if we specify a population we only get that population.
        collection = (
            Collection.objects.filter(dataset=self.dataset,
                                      metric=self.count_metric)
                              .exclude(population='control').first())
        response = self.client.get(
            reverse('metric', args=[self.count_metric.id]),
            data={'pop': ','.join([collection.population, 'control'])})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        assert len(data['populations']) == 2
        self.assertCountEqual([p['name'] for p in data['populations']],
                              [collection.population, 'control'])

    def test_defaults_to_all(self):
        response = self.client.get(
            reverse('metric', args=[self.count_metric.id]))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        assert len(data['populations']) == 2

    def test_unblanced_population(self):
        # Test a chart with no control group still works.

        # Remove the control group.
        Collection.objects.filter(dataset=self.dataset,
                                  metric=self.count_metric,
                                  population='control').delete()
        populations = self.dataset.get_populations()
        response = self.client.get(
            reverse('metric', args=[self.count_metric.id]),
            data={'pop': ','.join(populations)})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        assert len(data['populations']) == 1

    def test_subgroup_filter(self):
        response = self.client.get(
            reverse('metric', args=[self.count_metric.id]),
            data={'sg': 'Windows'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['subgroup'], 'Windows')
        assert len(data['populations']) == 2

    def test_invalid_subgroup_404(self):
        response = self.client.get(
            reverse('metric', args=[self.count_metric.id]),
            data={'sg': 'FxOS'})
        self.assertEqual(response.status_code, 404)


# This is separated to create a more custom set of data for testing.
class TestScalarMetric(TestCase):

    maxDiff = None

    @classmethod
    def setUpTestData(cls):
        scalar_metric = factories.MetricFactory(source_name='scalar_metric',
                                                type='UintScalar',
                                                description='scalar metric')
        dataset = factories.DataSetFactory()
        coll = factories.CollectionFactory(metric=scalar_metric,
                                           dataset=dataset,
                                           population='control')
        total = 3053.0
        data = {1: 100, 2: 500, 3: 300, 4: 200, 5: 190, 6: 180, 7: 170,
                8: 160, 9: 150, 10: 140, 11: 130, 12: 120, 13: 110, 14: 100,
                15: 90, 16: 80, 17: 70, 18: 60, 19: 50, 20: 40, 21: 30, 22: 20,
                23: 10, 24: 9, 25: 8, 26: 7, 27: 6, 28: 5, 29: 4, 30: 3, 31: 2,
                32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1}

        for rank, bucket in enumerate(sorted(data.keys()), 1):
            count = data[bucket]
            factories.PointFactory(collection=coll,
                                   bucket=bucket,
                                   proportion=count / total,
                                   count=count,
                                   rank=rank)

        cls.dataset = dataset
        cls.metric = scalar_metric

    def setUp(self):
        User.objects.create_user(username='testuser',
                                 email='example@mozilla.com',
                                 password='password')
        self.client.login(username='testuser', password='password')

    def test_basic(self):
        url = reverse('metric', args=[self.metric.id])
        response = self.client.get(url, data={'pop': 'control'})
        data = response.json()

        # Spot check some basic top level information.
        self.assertEqual(data['name'], self.metric.name)
        self.assertEqual(data['type'], self.metric.type)
        self.assertEqual(data['populations'][0]['name'], 'control')

        # Spot check a few buckets.
        points = data['populations'][0]['points']
        self.assertEqual(points[1],
                         {'b': '1', 'c': 100, 'refRank': 2,
                          'p': round(100 / 3053.0, 16)})
        # Bucket 19 should contain data from 19 and 20.
        self.assertEqual(points[19],
                         {'b': '19', 'c': 90, 'refRank': 20,
                          'p': round((50 + 40) / 3053.0, 16)})
        # Bucket 31 should contain data from 31, 32, 33.
        self.assertEqual(points[25],
                         {'b': '31', 'c': 4, 'refRank': 26,
                          'p': round((2 + 1 + 1) / 3053.0, 16)})
        # Make sure the last bucket to have data is included.
        self.assertEqual(points[28],
                         {'b': '40', 'c': 1, 'refRank': 29,
                          'p': round(1 / 3053.0, 16)})

    def test_basic_api_v2(self):
        url = reverse('v2-metric-by-id',
                      args=[self.dataset.id, self.metric.id])
        response = self.client.get(url)
        data = response.json()

        # Spot check some basic top level information.
        self.assertEqual(data['name'], self.metric.name)
        self.assertEqual(data['type'], self.metric.type)
        self.assertEqual(data['populations'][0]['name'], 'control')

        # Spot check a few buckets.
        points = data['populations'][0]['data']
        self.assertEqual(points[1],
                         {'x': 1, 'count': 100,
                          'y': round(100 / 3053.0, 16)})
        # Bucket 19 should contain data from 19 and 20.
        self.assertEqual(points[19],
                         {'x': 19, 'count': 90,
                          'y': round((50 + 40) / 3053.0, 16)})
        # Bucket 31 should contain data from 31, 32, 33.
        self.assertEqual(points[25],
                         {'x': 31, 'count': 4,
                          'y': round((2 + 1 + 1) / 3053.0, 16)})
        # Make sure the last bucket to have data is included.
        self.assertEqual(points[28],
                         {'x': 40, 'count': 1,
                          'y': round(1 / 3053.0, 16)})


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
            'metrics': [
                {
                    'id': self.count_metric.id,
                    'name': self.count_metric.name,
                    'description': self.count_metric.description,
                    'tooltip': self.count_metric.tooltip,
                    'type': 'CountHistogram',
                    'units': 'ms',
                }, {
                    'id': self.flag_metric.id,
                    'name': self.flag_metric.name,
                    'description': self.flag_metric.description,
                    'tooltip': self.flag_metric.tooltip,
                    'type': 'FlagHistogram',
                    'units': 'ms',
                }
            ]
        }
        self.assertEqual(response.json(), expected)

    def test_dataset_filter(self):

        # Add a 3rd metric we expect not to see.
        factories.MetricFactory(type='OtherHistogram')

        response = self.client.get(self.url, data={'ds': self.dataset.slug})
        metrics = [m['id'] for m in response.json()['metrics']]
        self.assertCountEqual(metrics,
                              [self.count_metric.id, self.flag_metric.id])

    def test_no_dataset(self):
        response = self.client.get(self.url, data={'ds': '999'})
        self.assertEqual(response.status_code, 404)
