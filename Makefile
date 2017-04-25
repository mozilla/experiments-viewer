.PHONY: build clean migrate shell stop test test-backend test-frontend up

help:
	@echo "The list of commands for local development:\n"
	@echo "  build         Builds the docker images for the docker-compose setup"
	@echo "  clean         Stops and removes all docker containers"
	@echo "  migrate       Runs the Django database migrations"
	@echo "  shell         Opens a Bash shell"
	@echo "  stop          Stops the docker containers"
	@echo "  test          Runs the Python test suite"
	@echo "  test-backend  Runs the Python test suite for backend tests only"
	@echo "  test-frontend Runs the Python test suite for frontend tests only"
	@echo "  up            Runs the whole stack, served under http://localhost:8000/\n"

build:
	docker-compose build

clean: stop
	docker-compose rm -f
	rm -rf coverage/ .coverage

migrate:
	docker-compose run server python manage.py migrate --run-syncdb

shell:
	docker-compose run server bash

stop:
	docker-compose stop

test:
	docker-compose run server test

test-backend:
	docker-compose run server test backend

test-frontend:
	docker-compose run server test frontend

up:
	docker-compose up
