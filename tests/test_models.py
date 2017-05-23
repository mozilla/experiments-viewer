from viewer.api.models import Collection

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

        self.assertCountEqual(self.dataset.get_populations(), pops)

    def test_get_subgroups(self):
        subgroups = list(
            Collection.objects.filter(dataset=self.dataset)
                              .exclude(subgroup='')
                              .distinct('subgroup')
                              .values_list('subgroup', flat=True))

        self.assertCountEqual(self.dataset.get_subgroups(), subgroups)
