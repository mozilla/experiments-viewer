from django.db.models.expressions import RawSQL
from django.db import models


class DataSetQuerySet(models.QuerySet):

    def visible(self):
        return self.filter(display=True)


class DataSet(models.Model):
    name = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    display = models.BooleanField(default=False)
    import_start = models.DateTimeField(null=True)
    import_stop = models.DateTimeField(null=True)

    objects = DataSetQuerySet.as_manager()

    class Meta:
        get_latest_by = 'date'

    def __unicode__(self):
        return self.date.strftime('%Y-%m-%d')

    def get_populations(self):
        populations = set()
        for collection in Collection.objects.filter(dataset=self):
            populations.add(collection.population)
        return list(populations)


TOOLTIP_HELP = (
    "The tooltip displayed on hover. Available variables are: "
    "{x} - the x-axis label (if categorical) or value, "
    "{y} - the y-axis value which will be the summed proportions, and "
    "{p} - the individual proportion for the hovered data point.")


class Metric(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    tooltip = models.CharField(
        max_length=255, blank=True,
        help_text=TOOLTIP_HELP)
    type = models.CharField(max_length=50)
    source_name = models.CharField(
        max_length=255,
        help_text="The metric's name in the source telemetry data.")

    def __unicode__(self):
        return u'<Metric %s [%s]>' % (self.name, self.type)


class Collection(models.Model):
    dataset = models.ForeignKey(DataSet)
    metric = models.ForeignKey(Metric)
    num_observations = models.IntegerField()
    population = models.CharField(max_length=255)

    def points(self):
        return self._points.annotate(
            cumulative=RawSQL('SUM(proportion) OVER (ORDER BY rank)', []))


class Point(models.Model):
    collection = models.ForeignKey(Collection, related_name='_points')
    bucket = models.CharField(max_length=255)
    proportion = models.FloatField()
    count = models.IntegerField(null=True)
    rank = models.IntegerField(null=True)
