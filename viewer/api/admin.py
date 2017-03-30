from django.conf.urls import url
from django.contrib import admin
from django.db import models
from django.forms.widgets import Textarea
from django.shortcuts import redirect
from django.template.response import TemplateResponse

from .forms import CSVForm


class MetricAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'source_name', 'type', 'tooltip', 'description']
    list_editable = list_display
    list_filter = ['type']
    list_display_links = None

    formfield_overrides = {
        models.TextField: {
            'widget': Textarea(attrs={'rows': 3, 'columns': 40})
        }
    }

    def get_urls(self):
        urls = super(MetricAdmin, self).get_urls()
        return [
            url(r'^import/$', self.admin_site.admin_view(self.batch_import)),
        ] + urls

    def batch_import(self, request):
        if request.method == 'POST':
            form = CSVForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                return redirect('admin:api_metric_changelist')
        else:
            form = CSVForm()
            return TemplateResponse(request, 'admin/api/metric_import.html',
                                    {'form': form})
