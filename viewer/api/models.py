from collections import namedtuple

from django.db import models


# Buckets used for histogram.
BUCKETS = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 21, 23, 25, 27, 29, 31, 34, 37, 40, 43, 46, 50, 54,
    58, 63, 68, 74, 80, 86, 93, 101, 109, 118, 128, 138, 149, 161,
    174, 188, 203, 219, 237, 256, 277, 299, 323, 349, 377, 408,
    441, 477, 516, 558, 603, 652, 705, 762, 824, 891, 963, 1041,
    1125, 1216, 1315, 1422, 1537, 1662, 1797, 1943, 2101, 2271,
    2455, 2654, 2869, 3102, 3354, 3626, 3920, 4238, 4582, 4954,
    5356, 5791, 6261, 6769, 7318, 7912, 8554, 9249, 10000
]


class DataSetQuerySet(models.QuerySet):

    def visible(self):
        return self.filter(display=True)


class DataSet(models.Model):
    name = models.CharField(max_length=255, default='')
    slug = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(null=True)
    date = models.DateField()
    display = models.BooleanField(default=False)
    import_start = models.DateTimeField(null=True)
    import_stop = models.DateTimeField(null=True)

    objects = DataSetQuerySet.as_manager()

    class Meta:
        get_latest_by = 'created_at'

    def __str__(self):
        return '%s, date=%s, display=%s' % (
            self.slug, self.created_at, self.display)

    def get_metrics(self):
        return list(
            Metric.objects.filter(collection__dataset=self)
                          .distinct('id')
                          .values_list('id', flat=True)
        )

    def get_populations(self):
        populations = (
            Collection.objects.filter(dataset=self)
                              .distinct('population')
                              .values_list('population', flat=True))

        stats = (
            Stats.objects.filter(dataset=self)
                         .values_list('population', 'key', 'value'))
        data = {
            p: {
                k: v for b, k, v in stats if b == p
            } for p in populations
        }

        return data

    def get_subgroups(self):
        return list(
            Collection.objects.filter(dataset=self)
                              .exclude(subgroup='')
                              .distinct('subgroup')
                              .values_list('subgroup', flat=True))


TOOLTIP_HELP = (
    "The tooltip displayed on hover. Available variables are: "
    "{x} - the x-axis label (if categorical) or value, "
    "{y} - the y-axis value which will be the summed proportions, and "
    "{p} - the individual proportion for the hovered data point.")


class Metric(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    tooltip = models.CharField(
        max_length=255, blank=True,
        help_text=TOOLTIP_HELP)
    type = models.CharField(max_length=50, blank=True, default='')
    units = models.CharField(max_length=50, blank=True, default='')
    source_name = models.CharField(
        max_length=255,
        help_text="The metric's name in the source telemetry data.")

    def __str__(self):
        return '%s, type=%s' % (self.name, self.type)


class Collection(models.Model):
    dataset = models.ForeignKey(DataSet)
    metric = models.ForeignKey(Metric)
    num_observations = models.IntegerField()
    population = models.CharField(max_length=255)
    subgroup = models.CharField(max_length=255, default='')

    def __str__(self):
        return (
            'population=%s, subgroup=%s, n=%d, dataset_id=%d, metric_id=%d'
            % (self.population, self.subgroup, self.num_observations,
               self.dataset_id, self.metric_id)
        )

    def points(self):
        return list(
            self._points.extra(select={'bucket_int': 'CAST(bucket AS INTEGER)'})
            .order_by('bucket_int'))

    def hdr(self):
        # Return points using pseudo HDR histogram bucketing.
        points = self.points()

        hist = {k: {'rank': i,
                    'count': 0,
                    'proportion': 0.0} for i, k in enumerate(BUCKETS)}
        p = points.pop(0)
        low_b = None

        for b in BUCKETS:
            if low_b is None:
                low_b = b
                continue

            if p is None:
                break

            while p.bucket_int >= low_b and p.bucket_int < b:
                hist[low_b]['count'] += p.count
                hist[low_b]['proportion'] += p.proportion

                try:
                    p = points.pop(0)
                except IndexError:
                    p = None
                    break

            low_b = b

        Hist = namedtuple('Hist', ['bucket', 'count', 'proportion', 'rank'])
        return [Hist(bucket=k, count=v['count'], proportion=v['proportion'],
                     rank=v['rank'])
                for k, v in hist.items()]


class Point(models.Model):
    collection = models.ForeignKey(Collection, related_name='_points')
    bucket = models.CharField(max_length=255)
    proportion = models.FloatField()
    count = models.BigIntegerField(null=True)
    rank = models.IntegerField(null=True)


class Stats(models.Model):
    dataset = models.ForeignKey(DataSet)
    metric = models.ForeignKey(Metric, blank=True, null=True)
    population = models.CharField(max_length=255, default='')
    subgroup = models.CharField(max_length=255, default='')
    key = models.CharField(max_length=100)
    value = models.IntegerField()
