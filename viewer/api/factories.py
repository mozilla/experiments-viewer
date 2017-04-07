import datetime

import factory

from . import models


class DataSetFactory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: u'Experiment %s' % n)
    date = factory.Sequence(
        lambda n: datetime.date.today() + datetime.timedelta(days=n))
    display = True

    class Meta:
        model = models.DataSet


class AbstractMetricFactory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: u'Metric %s' % n)
    description = factory.Sequence(lambda n: u'Description for metric %s' % n)

    class Meta:
        abstract = True


class CategoryMetricFactory(AbstractMetricFactory):
    type = 'C'

    class Meta:
        model = models.Metric


class NumericMetricFactory(AbstractMetricFactory):
    type = 'N'

    class Meta:
        model = models.Metric


class AbstractCollectionFactory(factory.django.DjangoModelFactory):
    dataset = factory.SubFactory(DataSetFactory)
    num_observations = 12345
    population = factory.Sequence(lambda n: u'Group %s' % (chr(65 + n)))

    class Meta:
        abstract = True


class CategoryCollectionFactory(AbstractCollectionFactory):
    metric = factory.SubFactory(CategoryMetricFactory)

    class Meta:
        model = models.CategoryCollection


class NumericCollectionFactory(AbstractCollectionFactory):
    metric = factory.SubFactory(NumericMetricFactory)

    class Meta:
        model = models.NumericCollection


class CategoryPointFactory(factory.django.DjangoModelFactory):
    collection = factory.SubFactory(CategoryCollectionFactory)
    bucket = factory.Iterator(['x86', 'arm', 'ppc'])
    proportion = factory.Iterator([0.90, 0.07, 0.03])
    rank = factory.Iterator([1, 2, 3])

    class Meta:
        model = models.CategoryPoint


class NumericPointFactory(factory.django.DjangoModelFactory):
    collection = factory.SubFactory(NumericCollectionFactory)
    bucket = factory.Iterator([1.0, 10.0, 100.0])
    proportion = factory.Iterator([0.90, 0.07, 0.03])

    class Meta:
        model = models.NumericPoint
