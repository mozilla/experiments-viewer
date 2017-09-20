from django.test import TestCase

from viewer.api import factories


SUBGROUPS = ('Windows', 'Linux', 'Mac', 'Other')


class DataTestCase(TestCase):

    maxDiff = None

    @classmethod
    def setUpTestData(cls):
        # This will create 3 datasets (1 of which being hidden) with 2
        # populations of 1 metric each.

        def collections_and_points(metric, **kwargs):
            coll = factories.CollectionFactory(metric=metric, **kwargs)
            factories.PointFactory.create_batch(3, collection=coll)
            return coll

        def create_collections(dataset, population, flag_metric, count_metric,
                               create_subgroups=True):

            kwargs = {'dataset': dataset}
            if population:
                kwargs['population'] = population

            coll = collections_and_points(count_metric, **kwargs)
            if create_subgroups:
                kwargs.pop('population', None)
                for sg in SUBGROUPS:
                    collections_and_points(count_metric,
                                           population=coll.population,
                                           subgroup=sg, **kwargs)

            if population:
                kwargs['population'] = population
            coll = collections_and_points(flag_metric, **kwargs)
            if create_subgroups:
                kwargs.pop('population', None)
                for sg in SUBGROUPS:
                    collections_and_points(flag_metric,
                                           population=coll.population,
                                           subgroup=sg, **kwargs)

        count_metric = factories.MetricFactory(type='CountHistogram')
        flag_metric = factories.MetricFactory(type='FlagHistogram')

        # Create 2 viewable datasets.
        dataset = factories.DataSetFactory()
        create_collections(dataset, 'control', flag_metric, count_metric)
        create_collections(dataset, 'chaos', flag_metric, count_metric)

        dataset_older = factories.DataSetFactory()
        create_collections(dataset_older, 'control', flag_metric, count_metric)
        create_collections(dataset_older, 'chaos', flag_metric, count_metric)

        # Create 1 non-viewable dataset.
        dataset_hidden = factories.DataSetFactory(display=False)
        create_collections(dataset_hidden, 'control', flag_metric,
                           count_metric, create_subgroups=False)
        create_collections(dataset_hidden, 'chaos', flag_metric, count_metric,
                           create_subgroups=False)

        # Create some stats tied to datasets.
        for pop in ('control', 'chaos'):
            factories.StatsFactory(dataset=dataset, metric=None, population=pop)
            factories.StatsFactory(dataset=dataset, metric=None, population=pop)

        # Save these for use in tests.
        cls.dataset = dataset
        cls.dataset_older = dataset_older
        cls.dataset_hidden = dataset_hidden
        cls.flag_metric = flag_metric
        cls.count_metric = count_metric
