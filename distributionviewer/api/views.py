from django.shortcuts import get_object_or_404
from rest_framework.decorators import (api_view, permission_classes,
                                       renderer_classes)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer

from .models import CategoryCollection, NumericCollection, Metric
from .renderers import MetricsJSONRenderer
from .serializers import (CategoryDistributionSerializer, MetricSerializer,
                          NumericDistributionSerializer)


def render_category(dist):
    s = CategoryDistributionSerializer(dist)
    return s.data


def render_numeric(dist):
    s = NumericDistributionSerializer(dist)
    return s.data


@api_view(['GET'])
@permission_classes([AllowAny])
@renderer_classes([JSONRenderer])
def metric(request, metric_id):
    metric = get_object_or_404(Metric, id=metric_id)
    if metric.type == 'C':
        qc = CategoryCollection.objects.filter(metric=metric)
        data = [render_category(d) for d in qc]
    elif metric.type == 'N':
        ql = NumericCollection.objects.filter(metric=metric)
        data = [render_numeric(d) for d in ql]
    return Response(data[0])


@api_view(['GET'])
@permission_classes([AllowAny])
@renderer_classes([MetricsJSONRenderer])
def metrics(request):
    metrics = Metric.objects.all().order_by('name')
    return Response([MetricSerializer(m).data for m in metrics])
