from django.conf.urls import url
from django.contrib.auth import views as django_auth_views

from .admin import admin_site
from .api import views as api_views
from .auth import views as auth_views
from .views import IndexView


urlpatterns = [
    # API v1
    url(r'^datasets/$', api_views.datasets, name='datasets'),
    url(r'^metrics/$', api_views.metrics, name='metrics'),
    url(r'^metric/(?P<metric_id>\d+)/$', api_views.metric, name='metric'),

    # API v2
    url(r'^v2/experiments/$', api_views.experiments,
        name='v2-experiments'),
    url(r'^v2/experiments/(?P<exp_id>\d+)/$', api_views.experiment_by_id,
        name='v2-experiment-by-id'),
    url(r'^v2/experiments/(?P<exp_id>\d+)/metrics/(?P<metric_id>\d+)/$',
        api_views.metric_by_id, name='v2-metric-by-id'),

    # Auth
    url(r'^accounts/login/$', auth_views.login_view, name='login'),
    url(r'^accounts/logout/$', django_auth_views.logout_then_login, name='logout'),
    url(r'^verify_google_token/$', auth_views.verify_google_token, name='verify_google_token'),

    # Admin
    url(r'^admin/login/$', auth_views.login_view),
    url(r'^admin/', admin_site.urls),

    # The catch-all.
    url(r'.*', IndexView.as_view(), name='index'),
]
