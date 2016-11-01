#!/bin/sh

./manage.py migrate --noinput
exec gunicorn distributionviewer.wsgi:application -b 0.0.0.0:${PORT:-8000} --log-file -
