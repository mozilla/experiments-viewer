# Development

1. `echo DEBUG=True >> .env`
2. `virtualenv env`
3. `source env/bin/activate`
4. `pip install -r requirements.txt`
5. `npm install`
6. In another terminal, install and run the database
    1. Install postgres
        * Mac: `brew install postgres`
    2. Run postgres
        * Mac: `brew services start postgresql` (see `brew info postgresql` for
          more info)
7. Back in the first terminal, set up the database
    1. Create a new user with name *distributionviewer* and password
       *distributionviewer*
        * Mac: `createuser --pwprompt distributionviewer`
    2. Create a new database named *distributionviewer* that the
       *distributionviewer* user has read/write access to
        * Mac: `createdb -Odistributionviewer -Eutf8 distributionviewer`
8. Still in the first terminal, run `python manage.py runserver`
9. Load [127.0.0.1:8000](http://127.0.0.1:8000)
