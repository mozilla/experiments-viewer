from django.contrib.postgres.fields import JSONField
from django.db.models.expressions import RawSQL
from django.db import models


class Metric(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
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


class LogCollection(Collection):
    def points(self):
        return self._points.annotate(
            cumulative=RawSQL("SUM(proportion) OVER (ORDER BY bucket)", []))


class LogPoint(models.Model):
    collection = models.ForeignKey(LogCollection, related_name="_points")
    bucket = models.FloatField()
    proportion = models.FloatField()


class CategoryPoint(models.Model):
    collection = models.ForeignKey(CategoryCollection, related_name="_points")
    bucket = models.CharField(max_length=255)
    proportion = models.FloatField()
    rank = models.IntegerField()
