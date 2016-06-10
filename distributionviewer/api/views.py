from rest_framework.decorators import (api_view, permission_classes,
                                       renderer_classes)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .fakedata import FAKE_DISTRIBUTION_DATA
from .renderers import DistributionJSONRenderer
from .serializers import (CategoryDistributionSerializer,
                          CategoryPointSerializer,
                          LogDistributionSerializer,
                          LogPointSerializer)


def renderit(dist):
    if dist['type'] == 'log':
        s = LogDistributionSerializer(data=dist)
    else:
        s = CategoryDistributionSerializer(data=dist)
    s.is_valid(raise_exception=True)
    return s.data


@api_view(['GET'])
@permission_classes([AllowAny])
@renderer_classes([DistributionJSONRenderer])
def distributions(request):
    return Response([renderit(d) for d in FAKE_DISTRIBUTION_DATA])

