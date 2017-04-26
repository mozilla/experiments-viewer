from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.reverse import reverse

from viewer.api import factories
from viewer.api.models import Collection, DataSet


class DataTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        # This will create 3 datasets (1 of which being hidden) with 2
        # populations of 1 metric each.

        def create_collections(dataset, population, flag_metric, count_metric):
            kwargs = {'dataset': dataset}
            if population:
                kwargs['population'] = population

            count_collection = factories.CollectionFactory(
                metric=count_metric, **kwargs)
            factories.PointFactory.create_batch(3, collection=count_collection)

            flag_collection = factories.CollectionFactory(
                metric=flag_metric, **kwargs)
            factories.PointFactory.create_batch(3, collection=flag_collection)

        count_metric = factories.MetricFactory(type='CountHistogram')
        flag_metric = factories.MetricFactory(type='FlagHistogram')

        # Create 2 viewable datasets.
        dataset_older = factories.DataSetFactory()
        create_collections(dataset_older, 'control', flag_metric, count_metric)
        create_collections(dataset_older, None, flag_metric, count_metric)

        dataset = factories.DataSetFactory()
        create_collections(dataset, 'control', flag_metric, count_metric)
        create_collections(dataset, None, flag_metric, count_metric)

        # Create 1 non-viewable dataset.
        dataset_hidden = factories.DataSetFactory(display=False)
        create_collections(dataset_hidden, 'control', flag_metric, count_metric)
        create_collections(dataset_hidden, None, flag_metric, count_metric)

        # Save these for use in tests.
        cls.dataset = dataset
        cls.dataset_older = dataset_older
        cls.dataset_hidden = dataset_hidden
        cls.flag_metric = flag_metric
        cls.count_metric = count_metric


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
                    'populations': self.dataset.get_populations(),
                },
                {
                    'id': self.dataset_older.id,
                    'name': self.dataset_older.name,
                    'populations': self.dataset_older.get_populations(),
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
        url = reverse('metric', args=[self.flag_metric.id])
        response = self.client.get(url)
        expected = {
            u'name': self.flag_metric.name,
            u'id': self.flag_metric.id,
            u'type': u'FlagHistogram',
            u'description': self.flag_metric.description,
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

        url = reverse('metric', args=[self.count_metric.id])
        response = self.client.get(url)
        expected = {
            u'name': self.count_metric.name,
            u'id': self.count_metric.id,
            u'type': u'CountHistogram',
            u'description': self.count_metric.description,
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

    def test_specific_experiment(self):
        # Test that passing ?ds= works.
        response = self.client.get(
            reverse('metric', args=[self.flag_metric.id]),
            data={'ds': self.dataset_older.id})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(DataSet.objects.visible().count(), 2)
        self.assertEqual(response.json()['dataSet'], self.dataset_older.name)

    def test_display_dataset(self):
        # Test that a newer dataset with display=False isn't returned.
        factories.DataSetFactory(display=False)

        response = self.client.get(
            reverse('metric', args=[self.flag_metric.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['dataSet'], self.dataset.name)

    def test_date_with_no_data_404(self):
        # Testing dataset id=999 should find no dataset and return a 404.
        response = self.client.get(
            reverse('metric', args=[self.flag_metric.id]),
            data={'ds': '999'})
        self.assertEqual(response.status_code, 404)

    def test_invalid_dataset(self):
        response = self.client.get(
            reverse('metric', args=[self.flag_metric.id]),
            data={'ds': 'foo'})
        self.assertEqual(response.status_code, 400)

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
            u'metrics': [
                {
                    u'id': self.count_metric.id,
                    u'name': self.count_metric.name,
                    u'description': self.count_metric.description,
                    u'tooltip': self.count_metric.tooltip,
                    u'type': u'CountHistogram',
                }, {
                    u'id': self.flag_metric.id,
                    u'name': self.flag_metric.name,
                    u'description': self.flag_metric.description,
                    u'tooltip': self.flag_metric.tooltip,
                    u'type': u'FlagHistogram',
                }
            ]
        }
        self.assertEqual(response.json(), expected)

    def test_dataset_filter(self):

        # Add a 3rd metric we expect not to see.
        factories.MetricFactory(type='OtherHistogram')

        response = self.client.get(self.url, data={'ds': self.dataset.id})
        metrics = [m['id'] for m in response.json()['metrics']]
        self.assertItemsEqual(metrics,
                              [self.count_metric.id, self.flag_metric.id])

    def test_invalid_dataset(self):
        response = self.client.get(self.url, data={'ds': 'foo'})
        self.assertEqual(response.status_code, 400)
