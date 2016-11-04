import csv

from django import forms

from .models import Metric


class CSVForm(forms.Form):
    """
    The CSVForm expects a CSV file with the following columns in this order:

        * source name: The name of the column in the cross sectional data set
        * name: The display name
        * type: Either "Numerical" or "Categorical"
        * tooltip: The chart hover tooltip text
        * description: The chart description

    """
    file = forms.FileField()

    def save(self):
        data = csv.reader(self.cleaned_data['file'])
        skipped_header = False

        for row in data:

            # Skip the CSV header row.
            if not skipped_header:
                skipped_header = True
                continue

            m_source, m_name, m_type, m_tooltip, m_descr = row

            if Metric.objects.filter(source_name=m_source).exists():
                # We don't update existing Metric objects.
                continue

            if not m_name or not m_type or not m_tooltip or not m_descr:
                # Skip rows with missing data
                continue

            if m_type.lower() == 'categorical':
                m_type = 'C'
            else:
                m_type = 'N'

            Metric.objects.create(
                source_name=m_source,
                name=m_name,
                type=m_type,
                tooltip=m_tooltip,
                description=m_descr)
