import datetime

import factory

from . import models


class DataSetFactory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: 'Experiment %s' % n)
    date = factory.Sequence(
        lambda n: datetime.date.today() + datetime.timedelta(days=n))
    display = True

    class Meta:
        model = models.DataSet


class MetricFactory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: 'Metric %s' % n)
    description = factory.Sequence(lambda n: 'Description for metric %s' % n)
    type = factory.Iterator(['BooleanHistogram', 'CountHistogram',
                             'EnumeratedHistogram', 'ExponentialHistogram',
                             'FlagHistogram'])

    class Meta:
        model = models.Metric


class CollectionFactory(factory.django.DjangoModelFactory):
    dataset = factory.SubFactory(DataSetFactory)
    metric = factory.SubFactory(MetricFactory)
    num_observations = 12345
    population = factory.Sequence(lambda n: 'Group %s' % n)
    subgroup = 'All'

    class Meta:
        model = models.Collection


class PointFactory(factory.django.DjangoModelFactory):
    collection = factory.SubFactory(CollectionFactory)
    bucket = factory.Iterator(['x86', 'arm', 'ppc'])
    proportion = factory.Iterator([0.90, 0.07, 0.03])
    count = 13579
    rank = factory.Iterator([1, 2, 3])

    class Meta:
        model = models.Point
