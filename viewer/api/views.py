from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.exceptions import NotFound
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from .models import Collection, DataSet, Metric
from .renderers import DataSetJSONRenderer, MetricsJSONRenderer
from .serializers import (DataSetSerializer, DistributionSerializer,
                          MetricSerializer)


@api_view(['GET'])
@renderer_classes([DataSetJSONRenderer])
def datasets(request):
    datasets = (
        DataSet.objects.visible()
                       .order_by(F('created_at').desc(nulls_last=True))
    )
    return Response([DataSetSerializer(d).data for d in datasets])


@api_view(['GET'])
@renderer_classes([MetricsJSONRenderer])
def metrics(request):
    metrics = Metric.objects.all().order_by('name')

    ds = request.query_params.get('ds')
    if ds:
        # Further filter metrics by dataset.
        metrics = (metrics.filter(collection__dataset__slug=ds)
                          .distinct('id', 'name'))
        if not metrics:
            raise NotFound('No data set with given dataset found.')

    return Response([MetricSerializer(m).data for m in metrics])


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def metric(request, metric_id):
    # Get requested dataset or most recent prior dataset by date.
    ds = request.query_params.get('ds')
    if ds:
        dataset = DataSet.objects.visible().filter(slug=ds).first()
    else:
        dataset = (
            DataSet.objects.visible()
                           .order_by(F('created_at').desc(nulls_last=True))
                           .first()
        )

    if not dataset:
        raise NotFound('No data set with given dataset found.')

    metric = get_object_or_404(Metric, id=metric_id)

    qs = (Collection.objects.select_related('dataset', 'metric')
                            .filter(dataset=dataset, metric=metric))

    sg = request.query_params.get('sg')
    if sg:
        qs = qs.filter(subgroup=sg)

    # Note: We simply get any record here to verify there is data.
    # We collect the requested populations later in the serializer.
    qs = qs.first()

    if not qs:
        raise NotFound('No metrics found for the given dataset.')

    pops = None
    pop = request.query_params.get('pop')
    if pop:
        pops = pop.split(',')

    serializer = DistributionSerializer(qs, populations=pops, subgroup=sg)
    return Response(serializer.data)


# API v2

@api_view(['GET'])
def experiments(request):
    datasets = (
        DataSet.objects.visible()
                       .order_by(F('created_at').desc(nulls_last=True))
    )
    data = []
    for d in datasets:
        data.append({
            'id': d.id,
            'name': d.name,
            'completed': True,  # TODO
        })

    return Response({'experiments': data})


@api_view(['GET'])
def experiment_by_id(request, exp_id):
    try:
        dataset = DataSet.objects.visible().get(id=exp_id)
    except DataSet.DoesNotExist:
        raise NotFound('No experiment with given id found.')

    data = {
        'id': dataset.id,
        'name': dataset.name,
        'description': '',  # TODO
        'authors': [],
        'populations': dataset.get_populations(),
        'subgroups': dataset.get_subgroups(),
        'metrics': dataset.get_metrics(),
    }
    return Response(data)


@api_view(['GET'])
def metric_by_id(request, exp_id, metric_id):
    metric = Metric.objects.get(id=metric_id)
    # TODO: Add subgroups.
    pops = Collection.objects.filter(dataset=exp_id,
                                     metric=metric_id,
                                     subgroup='All').order_by('population')

    populations = []
    for p in pops:
        if metric.type == 'UintScalar':
            populations.append({
                'name': p.population,
                'n': p.num_observations,
                'data': [
                    dict(x=d.bucket,
                         y=round(d.proportion, 16),
                         count=d.count) for d in p.hdr()
                ]
            })
        else:
            populations.append({
                'name': p.population,
                'n': p.num_observations,
                'data': [
                    dict(x=d.bucket,
                         y=round(d.proportion, 16),
                         count=d.count) for d in p.points()]
            })

    data = {
        'id': metric.id,
        'name': metric.name,
        'description': metric.description,
        'type': metric.type,
        'units': {'x': metric.units},
        'populations': populations,
    }

    return Response(data)
