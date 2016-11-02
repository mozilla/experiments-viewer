from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView

from . import views
from .api.views import login_view, metric, metrics, verify_google_token


urlpatterns = [
    url(r'^metrics/$', metrics, name='metrics'),
    url(r'^metric/(?P<metric_id>\d+)/$', metric, name='metric'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/login/$', login_view, name='login'),
    url(r'^accounts/logout/$', auth_views.logout_then_login, name='logout'),
    url(r'^verify_google_token/$', verify_google_token,
        name='verify_google_token'),

    # Cloudops URL requirements.
    url(r'^__version__', views.ops_version, name='ops-version'),
    url(r'^__heartbeat__', views.ops_heartbeat, name='ops-heartbeat'),
    url(r'^__lbheartbeat__', views.ops_lbheartbeat, name='ops-lbheartbeat'),

    # The catch-all.
    url(r'.*', login_required(TemplateView.as_view(
        template_name='distributionviewer/index.html')), name='index'),
]
