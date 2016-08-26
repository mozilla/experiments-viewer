from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView

from .api.views import login, metric, metrics


urlpatterns = [
    url(r'^metrics/$', metrics, name='metrics'),
    url(r'^metric/(?P<metric_id>\d+)/$', metric, name='metric'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/$', login, name='login'),
    url(r'.*', TemplateView.as_view(
        template_name='distributionviewer/index.html'), name='index')
]
