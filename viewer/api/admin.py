from django.contrib import admin
from django.db import models
from django.forms.widgets import Textarea


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
