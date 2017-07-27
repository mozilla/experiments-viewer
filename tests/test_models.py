from viewer.api.models import Collection, Stats

from . import DataTestCase


class TestDataSet(DataTestCase):

    def test_get_metrics(self):
        self.assertCountEqual(self.dataset.get_metrics(),
                              [self.flag_metric.id, self.count_metric.id])

    def test_get_populations(self):
        pops = list(
            Collection.objects.filter(dataset=self.dataset)
                              .distinct('population')
                              .values_list('population', flat=True))
        stats = (
            Stats.objects.filter(dataset=self.dataset)
                         .values_list('population', 'key', 'value'))
        expected = {
            p: {
                k: v for b, k, v in stats if b == p}
            for p in pops
        }
        actual = self.dataset.get_populations()

        self.assertEqual(actual, expected)
        self.assertEqual(len(actual.keys()), 2)
        assert actual['control'] is not {}

    def test_get_subgroups(self):
        subgroups = list(
            Collection.objects.filter(dataset=self.dataset)
                              .exclude(subgroup='')
                              .distinct('subgroup')
                              .values_list('subgroup', flat=True))

        self.assertCountEqual(self.dataset.get_subgroups(), subgroups)
