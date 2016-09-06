from django.test import TestCase
from rest_framework.reverse import reverse

from distributionviewer.api.models import (CategoryCollection, CategoryPoint,
                                           NumericCollection, NumericPoint,
                                           Metric)


class TestMetric(TestCase):

    def create_data(self):
        cat_metric = Metric.objects.create(id=1,
                                           name='Architecture',
                                           description='Architecture descr',
                                           type='C',
                                           metadata={})
        num_metric = Metric.objects.create(id=2,
                                           name='Searches Per Active Day',
                                           description='Searches descr',
                                           type='N',
                                           metadata={})

        cat_data = [
            ('x86', 0.95, 1),
            ('x86-64', 0.05, 2),
        ]
        cat_collection = CategoryCollection.objects.create(
            metric=cat_metric, num_observations=len(cat_data),
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
            metric=num_metric, num_observations=len(num_data),
            population='channel_release')
        for bucket, proportion in num_data:
            NumericPoint.objects.create(
                collection=num_collection, bucket=bucket,
                proportion=proportion)

    def test_basic(self):
        self.create_data()
        url = reverse('metric', args=['1'])
        response = self.client.get(url)
        expected = {
            u'numObs': 2,
            u'metric': u'Architecture',
            u'points': [
                {u'p': 0.95, u'c': 0.95, u'b': u'x86', u'refRank': 1},
                {u'p': 0.05, u'c': 1.0, u'b': u'x86-64', u'refRank': 2}
            ],
            u'type': u'category',
            u'description': u'Architecture descr'
        }
        url = reverse('metric', args=['2'])
        response = self.client.get(url)
        expected = {
            u'numObs': 4,
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

    def test_404(self):
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
