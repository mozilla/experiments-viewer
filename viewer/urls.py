from django.conf.urls import include, url
from django.contrib.auth import views as auth_views

from .views import IndexView
from .admin import admin_site
from .api.views import (datasets, login_view, metric, metrics,
                        verify_google_token)

urlpatterns = [
    url(r'^datasets/$', datasets, name='datasets'),
    url(r'^metrics/$', metrics, name='metrics'),
    url(r'^metric/(?P<metric_id>\d+)/$', metric, name='metric'),
    url(r'^admin/login/$', login_view),
    url(r'^admin/', include(admin_site.urls)),
    url(r'^accounts/login/$', login_view, name='login'),
    url(r'^accounts/logout/$', auth_views.logout_then_login, name='logout'),
    url(r'^verify_google_token/$', verify_google_token,
        name='verify_google_token'),

    # The catch-all.
    url(r'.*', IndexView.as_view(), name='index'),
]
