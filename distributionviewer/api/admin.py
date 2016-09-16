from django.contrib import admin

from .models import Metric


@admin.register(Metric)
class MetricAdmin(admin.ModelAdmin):
    list_display = ['name', 'source_name', 'type']
    list_filter = ['type']
