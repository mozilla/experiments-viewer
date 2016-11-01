Docker Dev Notes
================

Using Docker in development helps produce a consistent environment that's close
to the real production site.

Setup
=====

This documentation is going to assume you have Docker installed and configured
already. See the [Docker documentation][docker-docs] for help.

[docker-docs]: https://docs.docker.com/

* To launch the containers:

  `docker-compose up`

  Running `docker-compose up` from the root directory starts the database and
  web server. The frontend build step is the same as documented in the README
  and builds the static files on the host machine. The host machine and web
  server container share a volume.

* To populate the database with sample data:

  `docker exec distributionviewer_server_1 ./manage.py loaddata fixtures/sample.json`

* View the website in your browser at localhost:8000.

Tips & Tricks
=============

* To shell into one of the containers:

  `docker exec -ti distributionviewer_server_1 bash`

  This is necessary for running Django commands, among other things.

* Syntax & unit tests must pass for Pull Requests to be accepted on GitHub.

    * To run server tests:

      `docker exec distributionviewer_server_1 ./manage.py test`

    * To run server linting:

      `docker exec distributionviewer_server_1 flake8 distributionviewer`

* If you change `requirements.txt` to add dependencies for Django, you must rebuild `server`:

  `docker-compose build server`

* Sometimes the database container hasn't fully started when the Django container wants to connect to it. If this happens:

  * `docker ps` to get the name of the Django container (something like `distributionviewer_server_1`)
  * `docker restart distributionviewer_server_1` to restart the Django container
