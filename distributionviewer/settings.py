import os

import dj_database_url
from decouple import config


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY', default='change me to a real secret key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = ['*']

STATIC_ROOT = config('STATIC_ROOT', default=os.path.join(BASE_DIR,
                                                         'staticfiles'))
STATIC_URL = config('STATIC_URL', '/static/')

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'rest_framework',
    'distributionviewer.api',
    'distributionviewer.core',
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'distributionviewer.middleware.CORSMiddleware',
]

ROOT_URLCONF = 'distributionviewer.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        }
    }
]

WSGI_APPLICATION = 'distributionviewer.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases

DEFAULT_DATABASE = config(
    'DATABASE_URL',
    default='postgresql://distributionviewer:distributionviewer@localhost:5432/distributionviewer',
    cast=dj_database_url.parse)

DATABASES = {
    'default': DEFAULT_DATABASE,
}

# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = False

USE_L10N = False

USE_TZ = True

STATIC_URL = '/static/'

SECURE_SSL_REDIRECT = config('SSL_REDIRECT', default=False, cast=bool)
SECURE_HSTS_SECONDS = (60 * 60 * 24 * 365)
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),

    'DEFAULT_PERMISSION_CLASSES': (
        'distributionviewer.authentication.OptionsOrIsAuthenticated',
    ),
    'DATETIME_FORMAT': "%Y-%m-%dT%H:%M:%S",
}


AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

# Keys created from https://console.developers.google.com/apis/credentials
GOOGLE_AUTH_KEY = config(
    'GOOGLE_AUTH_KEY',
    '676697640342-o9mhtndrj60dk7jksdmmunetfmuqng4q.apps.googleusercontent.com')
GOOGLE_AUTH_SECRET = config('GOOGLE_AUTH_SECRET', '_HoDDGIq_ZrhBiES-ozIhUgh')
GOOGLE_AUTH_HOSTED_DOMAIN = 'mozilla.com'


# Sentry set up.
SENTRY_DSN = config('SENTRY_DSN', default=None)
if SENTRY_DSN:
    INSTALLED_APPS = INSTALLED_APPS + [
        'raven.contrib.django.raven_compat',
    ]
    RAVEN_CONFIG = {
        'dsn': SENTRY_DSN,
    }
