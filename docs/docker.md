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

  `make up`

  Running `docker-compose up` from the root directory starts the database and
  web server. The frontend build step (see [frontend docs](../docs/frontend.md))
  builds the static files on the host machine. The host machine and web server
  container share a volume.

* To populate the database with sample data:

  `docker-compose run server python manage.py loaddata fixtures/sample.json`

Testing
=======

Syntax & unit tests must pass for Pull Requests to be accepted on GitHub.

* To run all tests:

  `make test`

* To run only backend or frontend tests:

  `make test-backend` or `make test-frontend`


Tips & Tricks
=============

* To shell into the server container:

  `make shell`

  This is necessary for running Django commands, among other things.

* If you change `requirements.txt` to add dependencies for Django, you must rebuild `server`:

  `make build`
