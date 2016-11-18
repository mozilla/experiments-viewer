#!/bin/sh

run_back_end_tests() {
  ./manage.py test
  flake8 distributionviewer
}

run_front_end_tests() {
  ./node_modules/gulp/bin/gulp.js test
}

if [ $1 == "dev" ]; then
    # Wait for database to get started.
    /bin/sleep 5
    ./manage.py migrate --noinput
    # Try running this in a loop, so that the whole container
    # doesn't exit when runserver reloads and hits an error.
    while [ 1 ]; do
        ./manage.py runserver 0.0.0.0:8000
        sleep 1
    done

elif [ $1 == "prod" ]; then
    ./manage.py migrate --noinput
    exec gunicorn distributionviewer.wsgi:application -b 0.0.0.0:${PORT:-8000} --log-file -

elif [ $1 == "test" ]; then
    printenv  # Informational only.
    shift
    if [[ $1 == "backend" ]]; then
        shift
        run_back_end_tests $@
    elif [[ $1 == "frontend" ]]; then
        run_front_end_tests
    else
        run_back_end_tests $@
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

else
   echo "unknown mode: $1"
   exit 1
fi
