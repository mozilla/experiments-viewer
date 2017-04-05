from rest_framework import serializers

from .models import METRIC_TYPES, CategoryCollection, NumericCollection


class DataSetSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()


class MetricSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    description = serializers.CharField()
    tooltip = serializers.CharField()
    type = serializers.CharField(source='type_to_text')


class DistributionSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='metric.id')
    dataSet = serializers.DateField(source='dataset.name')
    name = serializers.CharField(source='metric.name')
    description = serializers.CharField(source='metric.description')
    populations = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.populations = kwargs.pop('populations', None)
        super(DistributionSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, obj):
        data = serializers.Serializer.to_representation(self, obj)
        data['type'] = self._type
        return data

    def get_populations(self, obj):
        populations = []
        for pop in self._collection_model.objects.filter(
                dataset=obj.dataset, metric=obj.metric,
                population__in=self.populations):
            data = {
                'name': pop.population,
                'numObs': pop.num_observations,
            }
            data['points'] = self._point_serializer(pop.points(),
                                                    many=True).data
            populations.append(data)

        return populations


class CategoryPointSerializer(serializers.Serializer):
    b = serializers.CharField(source='bucket')
    c = serializers.FloatField(source='cumulative')
    p = serializers.FloatField(source='proportion')
    refRank = serializers.IntegerField(source='rank')


class CategoryDistributionSerializer(DistributionSerializer):
    _type = METRIC_TYPES['C'].lower()
    _point_serializer = CategoryPointSerializer
    _collection_model = CategoryCollection


class NumericPointSerializer(serializers.Serializer):
    b = serializers.CharField(source='bucket')
    c = serializers.FloatField(source='cumulative')
    p = serializers.FloatField(source='proportion')


class NumericDistributionSerializer(DistributionSerializer):
    _type = METRIC_TYPES['N'].lower()
    _point_serializer = NumericPointSerializer
    _collection_model = NumericCollection
