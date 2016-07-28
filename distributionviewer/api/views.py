from rest_framework.decorators import (api_view, permission_classes,
                                       renderer_classes)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import CategoryCollection, LogCollection, Metric
from .renderers import DistributionJSONRenderer, MetricsJSONRenderer
from .serializers import (CategoryDistributionSerializer,
                          LogDistributionSerializer, MetricSerializer)


def render_category(dist):
    s = CategoryDistributionSerializer(dist)
    return s.data


def render_log(dist):
    s = LogDistributionSerializer(dist)
    return s.data


@api_view(['GET'])
@permission_classes([AllowAny])
@renderer_classes([DistributionJSONRenderer])
def distributions(request):
    qc = CategoryCollection.objects.all()
    ql = LogCollection.objects.all()
    return Response(
        [render_category(d) for d in qc] +
        [render_log(d) for d in ql])


@api_view(['GET'])
@permission_classes([AllowAny])
@renderer_classes([MetricsJSONRenderer])
def metrics(request):
    metrics = Metric.objects.all().order_by('name')
    return Response([MetricSerializer(m).data for m in metrics])
