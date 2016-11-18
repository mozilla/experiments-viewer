Frontend Dev Notes
==================

The frontend is a single page app built in React.

Setup
=====

1. `npm install`
2. `npm install -g gulp`

Run
===

1. `gulp watch`
2. Load [localhost:8000](http://localhost:8000)

New dependencies will need to be installed from time to time. Run `npm install`
if you see an error about a missing or out-of-date dependency:

Testing
=======

Run `gulp test` to run the frontend tests from your host machine.

If you'd like to run the frontend tests inside the docker container, run
`docker-compose run server test frontend`.
