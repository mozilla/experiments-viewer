from django.contrib import admin

from .models import Metric


@admin.register(Metric)
class MetricAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'source_name', 'type', 'tooltip', 'description']
    list_editable = list_display
    list_filter = ['type']
