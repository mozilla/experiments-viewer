import os
from datetime import timedelta

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

SITE_URL = config('SITE_URL', default='http://localhost:8000')
STATIC_ROOT = config('STATIC_ROOT', default=os.path.join(BASE_DIR,
                                                         'staticfiles'))
STATIC_URL = config('STATIC_URL', '/static/')

LOGIN_URL = '/accounts/login/'

# Application definition

INSTALLED_APPS = [
    # Django
    'django.contrib.admin.apps.SimpleAdminConfig',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',

    # 3rd party
    'dockerflow.django',
    'rest_framework',

    # Project
    'viewer',
    'viewer.api',
]

MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'dockerflow.django.middleware.DockerflowMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'viewer.middleware.CORSMiddleware',
]

ROOT_URLCONF = 'viewer.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.template.context_processors.request',
                'viewer.context_processors.settings',
            ],
        }
    }
]

WSGI_APPLICATION = 'viewer.wsgi.application'

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

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = int(timedelta(days=365).total_seconds())
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = config('SSL_REDIRECT', default=False, cast=bool)
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=False, cast=bool)
X_FRAME_OPTIONS = 'DENY'

CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SECURE = True

SILENCED_SYSTEM_CHECKS = [
    'security.W005',  # Deployed on Heroku and will not have subdomains.
]


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),

    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
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

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            '()': 'dockerflow.logging.JsonLogFormatter',
            'logger_name': 'experiments-viewer',
        },
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(name)s %(message)s',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',  # TODO: Use 'json' for Dockerflow.
        },
        'sentry': {
            'level': 'ERROR',
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
        },
    },
    'loggers': {
        # TODO: Enable when moving to Dockerflow.
        # 'request.summary': {
        #     'level': 'DEBUG',
        #     'handlers': ['console'],
        #     'propagate': False,
        # },
    }
}
