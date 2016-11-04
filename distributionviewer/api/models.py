from django.db.models.expressions import RawSQL
from django.db import models


class DataSet(models.Model):
    date = models.DateField()

    class Meta:
        get_latest_by = 'date'

    def __unicode__(self):
        return self.date.strftime('%Y-%m-%d')


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
    type = models.CharField(
        max_length=1, choices=(('C', 'Categorical'), ('N', 'Numerical')),
        default='N')
    source_name = models.CharField(
        max_length=255,
        help_text="The metric's name in the source telemetry data.")

    def __unicode__(self):
        return self.name


class Collection(models.Model):
    dataset = models.ForeignKey(DataSet)
    metric = models.ForeignKey(Metric)
    num_observations = models.IntegerField()
    population = models.CharField(max_length=255)

    class Meta:
        abstract = True


class CategoryCollection(Collection):
    def points(self):
        return self._points.annotate(
            cumulative=RawSQL('SUM(proportion) OVER (ORDER BY rank)', []))


class CategoryPoint(models.Model):
    collection = models.ForeignKey(CategoryCollection, related_name='_points')
    bucket = models.CharField(max_length=255)
    proportion = models.FloatField()
    rank = models.IntegerField()


class NumericCollection(Collection):
    def points(self):
        return self._points.annotate(
            cumulative=RawSQL('SUM(proportion) OVER (ORDER BY bucket)', []))


class NumericPoint(models.Model):
    collection = models.ForeignKey(NumericCollection, related_name='_points')
    bucket = models.FloatField()
    proportion = models.FloatField()
