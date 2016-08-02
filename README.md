# Development

## Install

Follow these steps to install distribution-viewer locally:

1. Install any of the following that are not installed already
    * git
    * npm
    * pip
    * postgres
    * python
    * virtualenv
2. `git clone https://github.com/mozilla/distribution-viewer.git`
3. `cd distribution-viewer`
4. `echo DEBUG=True >> .env`
5. `virtualenv env`
6. `source env/bin/activate`
7. `pip install -r requirements.txt`
8. `npm install`
9. `npm install -g gulp`
10. Start PostgreSQL
    * Mac: `brew services start postgresql` (see `brew info postgresql` for more
      info)
11. Set up the database
    1. Create a new user with name *distributionviewer* and password
       *distributionviewer*
        * Mac: `createuser --pwprompt distributionviewer`
    2. Create a new database named *distributionviewer* that the
       *distributionviewer* user has read/write access to
        * Mac: `createdb -Odistributionviewer -Eutf8 distributionviewer`

## Run

1. Start PostgreSQL
    * If you just finished the install instructions or if you ran `brew services
      start postgresql` at any point in the past, PostgreSQL should already be
      running
2. `source env/bin/activate`
3. `./manage.py runserver`
4. In another terminal: `gulp watch`
4. Load [127.0.0.1:8000](http://127.0.0.1:8000)

New dependencies will need to be installed from time to time. Run the following
if you see an error about a missing or out-of-date dependency:

1. `pip install -U -r requirements.txt`
2. `npm install`
