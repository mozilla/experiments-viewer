import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from oauth2client import client, crypt
from rest_framework.decorators import (api_view, permission_classes,
                                       renderer_classes)
from rest_framework.exceptions import (AuthenticationFailed, NotFound,
                                       ParseError, ValidationError)
from rest_framework.permissions import AllowAny
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from distributionviewer.authentication import commonplace_token

from .models import CategoryCollection, DataSet, Metric, NumericCollection
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
    # Get requested dataset or most recent prior dataset from date.
    date = request.query_params.get('date',
                                    datetime.date.today().strftime('%Y-%m-%d'))
    try:
        date = datetime.datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        raise ParseError('Date provided not valid.')

    dataset = DataSet.objects.filter(date__lte=date).order_by('-date').first()
    if not dataset:
        raise NotFound('No data set with given date found.')

    metric = get_object_or_404(Metric, id=metric_id)
    if metric.type == 'C':
        qc = CategoryCollection.objects.filter(dataset=dataset, metric=metric)
        data = [render_category(d) for d in qc]
    elif metric.type == 'N':
        ql = NumericCollection.objects.filter(dataset=dataset, metric=metric)
        data = [render_numeric(d) for d in ql]
    return Response(data[0])


@api_view(['GET'])
@permission_classes([AllowAny])
@renderer_classes([MetricsJSONRenderer])
def metrics(request):
    metrics = Metric.objects.all().order_by('name')
    return Response([MetricSerializer(m).data for m in metrics])


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    token = request.data.get('token')
    if token is None:
        raise ValidationError({'detail': 'Auth token required.'})
    try:
        idinfo = client.verify_id_token(token, settings.GOOGLE_AUTH_KEY)
        if idinfo['iss'] not in ['accounts.google.com',
                                 'https://accounts.google.com']:
            raise crypt.AppIdentityError('Wrong issuer.')
        if idinfo.get('hd') != settings.GOOGLE_AUTH_HOSTED_DOMAIN:
            raise crypt.AppIdentityError('Wrong hosted domain.')
    except crypt.AppIdentityError as e:
        raise AuthenticationFailed(e)
    defaults = {
        'email': idinfo['email'],
        'first_name': idinfo.get('given_name', ''),
        'last_name': idinfo.get('family_name', ''),
    }
    user, created = get_user_model().objects.get_or_create(
        username=idinfo['email'], defaults=defaults)
    return Response({
        'email': idinfo['email'],
        'token': commonplace_token(idinfo['email'])
    })
