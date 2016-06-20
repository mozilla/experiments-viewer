from rest_framework import serializers


class CategoryPointSerializer(serializers.Serializer):
    b = serializers.CharField(source='bucket')
    c = serializers.FloatField(source='cumulative')
    p = serializers.FloatField(source='proportion')
    refRank = serializers.IntegerField(source='rank')


class CategoryDistributionSerializer(serializers.Serializer):

    points = CategoryPointSerializer(many=True)
    metric = serializers.CharField()
    numObs = serializers.IntegerField(source='num_observations')

    def to_representation(self, obj):
        data = serializers.Serializer.to_representation(self, obj)
        data['type'] = 'category'
        return data


class LogPointSerializer(serializers.Serializer):
    b = serializers.CharField(source='bucket')
    c = serializers.FloatField(source='cumulative')
    p = serializers.FloatField(source='proportion')


class LogDistributionSerializer(serializers.Serializer):

    points = LogPointSerializer(many=True)
    metric = serializers.CharField()
    numObs = serializers.IntegerField(source='num_observations')

    def to_representation(self, obj):
        data = serializers.Serializer.to_representation(self, obj)
        data['type'] = 'log'
        return data
