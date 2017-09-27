from rest_framework import serializers

from .models import Collection


class DataSetSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    slug = serializers.CharField()
    date = serializers.CharField()
    metrics = serializers.SerializerMethodField()
    populations = serializers.SerializerMethodField()
    subgroups = serializers.SerializerMethodField()

    def get_metrics(self, obj):
        return obj.get_metrics()

    def get_populations(self, obj):
        return obj.get_populations()

    def get_subgroups(self, obj):
        return obj.get_subgroups()


class MetricSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField()
    tooltip = serializers.CharField()
    type = serializers.CharField()
    units = serializers.CharField()


class DistributionSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='metric.id')
    dataSet = serializers.CharField(source='dataset.slug')
    name = serializers.CharField(source='metric.name')
    description = serializers.CharField(source='metric.description')
    type = serializers.CharField(source='metric.type')
    subgroup = serializers.SerializerMethodField()
    populations = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.populations = kwargs.pop('populations', None)
        subgroup = kwargs.pop('subgroup')
        # If it's ``None``, default to "All".
        self.subgroup = subgroup if subgroup else 'All'
        super(DistributionSerializer, self).__init__(*args, **kwargs)

    def get_subgroup(self, obj):
        return obj.subgroup if obj.subgroup else None

    def get_populations(self, obj):
        collections = (Collection.objects.select_related('dataset', 'metric')
                                         .filter(dataset=obj.dataset,
                                                 metric=obj.metric,
                                                 subgroup=self.subgroup))

        if self.populations:
            collections = collections.filter(population__in=self.populations)

        populations = []
        for c in collections:
            data = {
                'name': c.population,
                'numObs': c.num_observations,
            }
            data['points'] = PointSerializer(c.points(), many=True).data
            populations.append(data)

        return populations


class PointSerializer(serializers.Serializer):
    b = serializers.CharField(source='bucket')
    c = serializers.FloatField(source='cumulative')
    p = serializers.FloatField(source='proportion')
    refRank = serializers.IntegerField(source='rank')
