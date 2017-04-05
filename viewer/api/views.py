from django.conf import settings
from django.contrib.auth import get_user_model, login
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.views.decorators.csrf import csrf_exempt
from oauth2client import client, crypt
from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes, renderer_classes)
from rest_framework.exceptions import (AuthenticationFailed, NotFound,
                                       ValidationError)
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from .models import CategoryCollection, DataSet, Metric, NumericCollection
from .renderers import DataSetJSONRenderer, MetricsJSONRenderer
from .serializers import (CategoryDistributionSerializer, DataSetSerializer,
                          MetricSerializer, NumericDistributionSerializer)


@api_view(['GET'])
@renderer_classes([DataSetJSONRenderer])
def datasets(request):
    datasets = DataSet.objects.filter(display=True).order_by('-date')
    return Response([DataSetSerializer(d).data for d in datasets])


@api_view(['GET'])
@renderer_classes([MetricsJSONRenderer])
def metrics(request):
    metrics = Metric.objects.all().order_by('name')
    return Response([MetricSerializer(m).data for m in metrics])


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def metric(request, metric_id):
    # Get requested population or default to "control".
    pop = request.query_params.get('pop', 'control')
    pops = pop.split(',')

    # Get requested dataset or most recent prior dataset from date.
    exp = request.query_params.get('exp')

    if exp:
        dataset = DataSet.objects.filter(display=True, name=exp).first()
    else:
        dataset = DataSet.objects.filter(display=True).order_by('-date').first()

    if not dataset:
        raise NotFound('No data set with given name found.')

    metric = get_object_or_404(Metric, id=metric_id)

    # Note: We filter by `population='control'` here to get a single record.
    # We collect the requested populations later in the serializer.
    if metric.type == 'C':
        qs = (CategoryCollection.objects.select_related('dataset', 'metric')
                                        .get(dataset=dataset, metric=metric,
                                             population='control'))
        serializer = CategoryDistributionSerializer(qs, populations=pops)
        return Response(serializer.data)

    elif metric.type == 'N':
        qs = (NumericCollection.objects.select_related('dataset', 'metric')
                                       .get(dataset=dataset, metric=metric,
                                            population='control'))
        serializer = NumericDistributionSerializer(qs, populations=pops)
        return Response(serializer.data)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def verify_google_token(request):
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
    user.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, user)
    return Response({})


def login_view(request):
    return TemplateResponse(
        request,
        template='viewer/login.html',
        context={'google_clientid': settings.GOOGLE_AUTH_KEY,
                 'next': request.GET.get('next', '/')})
