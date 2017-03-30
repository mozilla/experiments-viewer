import json
import os.path

from django.conf import settings
from django.http import HttpResponse, HttpResponseServerError, JsonResponse

from .api.models import Metric


def ops_lbheartbeat(request):
    return HttpResponse('ok')


def ops_heartbeat(request):
    try:
        # Check the database by counting Metrics.
        Metric.objects.count()
        # TODO: Add checks for other dependencies as we add them
        return HttpResponse('ok')
    except:
        return HttpResponseServerError('database failure')


def ops_version(request):
    # TODO: Generate this via TravisCI.
    VERSION_FN = '%s/version.json' % settings.BASE_DIR
    if os.path.exists(VERSION_FN):
        data = json.load(open(VERSION_FN, 'r'))
    else:
        data = {
            "source": "https://github.com/mozilla/distribution-viewer.git",
            "version": "dev",
            "commit": "dev"
        }
    return JsonResponse(data)
