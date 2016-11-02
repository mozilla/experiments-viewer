#!/bin/sh

# Wait for database to get started.
/bin/sleep 5

./manage.py migrate --noinput

# Try running this in a loop, so that the whole container doesn't exit when
# runserver reloads and hits an error
while [ 1 ]; do
    ./manage.py runserver 0.0.0.0:8000
    sleep 1
done
