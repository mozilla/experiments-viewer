from django.test import TestCase
from rest_framework.reverse import reverse

from distributionviewer.api.models import (CategoryCollection, CategoryPoint,
                                           LogCollection, LogPoint, Metric)


class TestDistribution(TestCase):

    def setUp(self):
        self.url = reverse('distributions')

    def create_data(self):
        cat_metric = Metric.objects.create(name='architecture',
                                           description='architecture descr',
                                           metadata={})
        log_metric = Metric.objects.create(name='searchesPerActiveDay',
                                           description='searches descr',
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

        log_data = [
            (0, 0.1),
            (1, 0.4),
            (5, 0.3),
            (10, 0.1),
        ]
        log_collection = LogCollection.objects.create(
            metric=log_metric, num_observations=len(log_data),
            population='channel_release')
        for bucket, proportion in log_data:
            LogPoint.objects.create(
                collection=log_collection, bucket=bucket,
                proportion=proportion)

    def test_basic(self):
        self.create_data()
        response = self.client.get(self.url)
        expected = {
            u'distributions': [{
                u'numObs': 2,
                u'metric': u'architecture',
                u'points': [
                    {u'p': 0.95, u'c': 0.95, u'b': u'x86', u'refRank': 1},
                    {u'p': 0.05, u'c': 1.0, u'b': u'x86-64', u'refRank': 2}
                ],
                u'type': u'category',
                u'description': u'architecture descr'
            }, {
                u'numObs': 4,
                u'metric': u'searchesPerActiveDay',
                u'points': [
                    {u'p': 0.1, u'c': 0.1, u'b': u'0.0'},
                    {u'p': 0.4, u'c': 0.5, u'b': u'1.0'},
                    {u'p': 0.3, u'c': 0.8, u'b': u'5.0'},
                    {u'p': 0.1, u'c': 0.9, u'b': u'10.0'}
                ],
                u'type': u'log',
                u'description': u'searches descr'
            }]
        }
        self.assertEqual(response.json(), expected)


class TestMetrics(TestCase):

    def setUp(self):
        self.url = reverse('metrics')

    def create_data(self):
        Metric.objects.create(name='architecture',
                              description='architecture descr', metadata={})
        Metric.objects.create(name='searchesPerActiveDay',
                              description='searches descr', metadata={})

    def test_basic(self):
        self.create_data()
        response = self.client.get(self.url)
        expected = {
            u'metrics': [{
                u'name': u'architecture',
                u'description': u'architecture descr',
            }, {
                u'name': u'searchesPerActiveDay',
                u'description': u'searches descr',
            }]
        }
        self.assertEqual(response.json(), expected)
