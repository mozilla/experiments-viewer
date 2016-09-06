from django.contrib.postgres.fields import JSONField
from django.db.models.expressions import RawSQL
from django.db import models


class Metric(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    type = models.CharField(
        max_length=1, choices=(('C', 'Categorical'), ('N', 'Numerical')),
        default='N')
    source_name = models.CharField(
        max_length=255,
        help_text="The metric's name in the source telemetry data.")
    metadata = JSONField()


class Collection(models.Model):
    metric = models.ForeignKey(Metric)
    num_observations = models.IntegerField()
    population = models.CharField(max_length=255)

    class Meta:
        abstract = True


class CategoryCollection(Collection):
    def points(self):
        return self._points.annotate(
            cumulative=RawSQL("SUM(proportion) OVER (ORDER BY rank)", []))


class CategoryPoint(models.Model):
    collection = models.ForeignKey(CategoryCollection, related_name="_points")
    bucket = models.CharField(max_length=255)
    proportion = models.FloatField()
    rank = models.IntegerField()


class NumericCollection(Collection):
    def points(self):
        return self._points.annotate(
            cumulative=RawSQL("SUM(proportion) OVER (ORDER BY bucket)", []))


class NumericPoint(models.Model):
    collection = models.ForeignKey(NumericCollection, related_name="_points")
    bucket = models.FloatField()
    proportion = models.FloatField()
