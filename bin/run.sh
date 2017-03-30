#!/bin/sh

run_back_end_tests() {
  flake8 viewer && ./manage.py test
}

run_front_end_tests() {
  ./node_modules/gulp/bin/gulp.js test
}

case $1 in
  dev)
    # Wait for database to get started.
    ./bin/wait-for-it.sh db:5432 --timeout=0 --strict
    if [ $? -eq 0 ]
    then
        ./manage.py migrate --noinput
        # Try running this in a loop, so that the whole container
        # doesn't exit when runserver reloads and hits an error.
        while [ 1 ]; do
            ./manage.py runserver 0.0.0.0:8000
            sleep 1
        done
    fi
    ;;
  prod)
    ./manage.py migrate --noinput
    exec gunicorn viewer.wsgi:application -b 0.0.0.0:${PORT:-8000} --log-file -
    ;;
  test)
    printenv  # Informational only.
    shift
    if [[ $1 == "backend" ]]; then
        shift
        run_back_end_tests
    elif [[ $1 == "frontend" ]]; then
        run_front_end_tests
    else
        run_back_end_tests
        backend_rc=$?
        run_front_end_tests
        frontend_rc=$?
        echo

        if [[ $backend_rc == 0 && $frontend_rc == 0 ]]; then
            echo "All tests pass!!!"
            exit 0
        else
            echo "FAIL FAIL FAIL. Some tests failed, see above for details."
            exit 1
        fi
    fi
    ;;
  *)
    exec "$@"
    ;;
esac
