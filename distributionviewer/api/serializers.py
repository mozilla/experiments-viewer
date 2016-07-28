from rest_framework import serializers


class MetricSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField()


class CategoryPointSerializer(serializers.Serializer):
    b = serializers.CharField(source='bucket')
    c = serializers.FloatField(source='cumulative')
    p = serializers.FloatField(source='proportion')
    refRank = serializers.IntegerField(source='rank')


class DistributionSerializer(serializers.Serializer):
    numObs = serializers.IntegerField(source='num_observations')
    metric = serializers.CharField(source='metric.name')
    description = serializers.CharField(source='metric.description')

    def to_representation(self, obj):
        data = serializers.Serializer.to_representation(self, obj)
        data['type'] = self._type
        return data


class CategoryDistributionSerializer(DistributionSerializer):
    points = CategoryPointSerializer(many=True)
    _type = 'category'


class LogPointSerializer(serializers.Serializer):
    b = serializers.CharField(source='bucket')
    c = serializers.FloatField(source='cumulative')
    p = serializers.FloatField(source='proportion')


class LogDistributionSerializer(DistributionSerializer):
    points = LogPointSerializer(many=True)
    _type = 'log'
