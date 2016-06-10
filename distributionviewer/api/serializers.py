from rest_framework import serializers


class CategoryPointSerializer(serializers.Serializer):
    b = serializers.CharField()
    c = serializers.FloatField()
    p = serializers.FloatField()
    refRank = serializers.IntegerField()


class CategoryDistributionSerializer(serializers.Serializer):

    points = CategoryPointSerializer(many=True)
    metric = serializers.CharField()
    numObs = serializers.IntegerField()

    def to_representation(self, obj):
        data = serializers.Serializer.to_representation(self, obj)
        data['type'] = 'category'
        return data


class LogPointSerializer(serializers.Serializer):
    b = serializers.FloatField()
    c = serializers.FloatField()
    p = serializers.FloatField()


class LogDistributionSerializer(serializers.Serializer):

    points = LogPointSerializer(many=True)
    metric = serializers.CharField()
    numObs = serializers.IntegerField()

    def to_representation(self, obj):
        data = serializers.Serializer.to_representation(self, obj)
        data['type'] = 'log'
        return data
