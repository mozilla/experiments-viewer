from rest_framework import serializers

from .models import Collection


class DataSetSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    populations = serializers.SerializerMethodField()

    def get_populations(self, obj):
        return obj.get_populations()


class MetricSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField()
    tooltip = serializers.CharField()
    type = serializers.CharField()


class DistributionSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='metric.id')
    dataSet = serializers.DateField(source='dataset.name')
    name = serializers.CharField(source='metric.name')
    description = serializers.CharField(source='metric.description')
    type = serializers.CharField(source='metric.type')
    populations = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.populations = kwargs.pop('populations', None)
        super(DistributionSerializer, self).__init__(*args, **kwargs)

    def get_populations(self, obj):
        populations = []
        for pop in Collection.objects.filter(
                dataset=obj.dataset, metric=obj.metric,
                population__in=self.populations):
            data = {
                'name': pop.population,
                'numObs': pop.num_observations,
            }
            data['points'] = PointSerializer(pop.points(), many=True).data
            populations.append(data)

        return populations


class PointSerializer(serializers.Serializer):
    b = serializers.CharField(source='bucket')
    c = serializers.FloatField(source='cumulative')
    p = serializers.FloatField(source='proportion')
    refRank = serializers.IntegerField(source='rank')
