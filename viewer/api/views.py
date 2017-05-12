from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.exceptions import NotFound, ParseError
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from .models import Collection, DataSet, Metric
from .renderers import DataSetJSONRenderer, MetricsJSONRenderer
from .serializers import (DataSetSerializer, DistributionSerializer,
                          MetricSerializer)


def get_and_validate_dataset_id(request, param_name):
    ds = request.query_params.get(param_name)
    if ds:
        try:
            ds = int(ds)
        except ValueError:
            raise ParseError('DataSet ID provided is not an integer.')
        return ds

    return None


@api_view(['GET'])
@renderer_classes([DataSetJSONRenderer])
def datasets(request):
    datasets = DataSet.objects.visible().order_by('-date')
    return Response([DataSetSerializer(d).data for d in datasets])


@api_view(['GET'])
@renderer_classes([MetricsJSONRenderer])
def metrics(request):
    metrics = Metric.objects.all().order_by('name')

    ds = get_and_validate_dataset_id(request, 'ds')
    if ds:
        # Further filter metrics by dataset.
        metrics = (metrics.filter(collection__dataset_id=ds)
                          .distinct('id', 'name'))

    return Response([MetricSerializer(m).data for m in metrics])


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def metric(request, metric_id):
    # Get requested population or default to "control".
    pop = request.query_params.get('pop', 'control')
    pops = pop.split(',')

    # Get requested dataset or most recent prior dataset from date.
    ds = get_and_validate_dataset_id(request, 'ds')
    if ds:
        dataset = DataSet.objects.visible().filter(id=ds).first()
    else:
        dataset = DataSet.objects.visible().order_by('-date').first()

    if not dataset:
        raise NotFound('No data set with given name found.')

    metric = get_object_or_404(Metric, id=metric_id)

    # Note: We filter by `population='control'` here to get a single record.
    # We collect the requested populations later in the serializer.
    qs = (Collection.objects.select_related('dataset', 'metric')
                            .filter(dataset=dataset, metric=metric)
                            .first())
    if not qs:
        raise NotFound('No metrics found for the given dataset.')

    serializer = DistributionSerializer(qs, populations=pops)
    return Response(serializer.data)
