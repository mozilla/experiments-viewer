import datetime
import logging
from os import environ

import boto3
import psycopg2
import requests
import ujson
from psycopg2.extras import LoggingConnection, execute_values
from pyspark.sql import SparkSession


BUCKET = environ.get('bucket', 'telemetry-parquet')
DB = environ.get('db', 'experiments-viewer-db')
PATH = 's3://%s/experiments_aggregates/v1/' % BUCKET
NORMANDY_URL = ('https://normandy.services.mozilla.com/api/v1/recipe/'
                '?latest_revision__action=3')
LOG_LEVEL = logging.INFO  # Change to incr/decr logging output.
DEBUG_SQL = False  # Set to True to not insert any data.

EXPERIMENTS = None
METRICS = None

logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(__name__)


class StaleImportError(Exception):
    "Raise when we detect that we're importing data older than existing data."


def get_database_connection():
    global logger

    s3 = boto3.resource('s3')
    metasrcs = ujson.load(
        s3.Object('net-mozaws-prod-us-west-2-pipeline-metadata',
                  'sources.json').get()['Body'])
    creds = ujson.load(
        s3.Object(
            'net-mozaws-prod-us-west-2-pipeline-metadata',
            '%s/write/credentials.json'
            % metasrcs[DB]['metadata_prefix']
        ).get()['Body'])
    conn = psycopg2.connect(connection_factory=LoggingConnection,
                            host=creds['host'], port=creds.get('port', 5432),
                            user=creds['username'], password=creds['password'],
                            dbname=creds['db_name'])
    conn.initialize(logger)
    return conn


def get_experiments():
    global EXPERIMENTS

    if EXPERIMENTS is not None:
        return EXPERIMENTS

    resp = requests.get(NORMANDY_URL)
    if resp.status_code == 200:
        EXPERIMENTS = {r['arguments']['slug']: r for r in resp.json()}
    else:
        EXPERIMENTS = {}

    return EXPERIMENTS


def create_dataset(cursor, exp, process_date):
    # Check last import date to avoid importing stale data via backfills.
    process_date_dt = datetime.datetime.strptime(process_date, '%Y%m%d').date()

    experiments = get_experiments()
    experiment_name = experiments.get(exp, {}).get('name', '')
    try:
        experiment_created_at = datetime.datetime.strptime(
            experiments.get(exp, {})
                       .get('approval_request', {})
                       .get('created', ''), '%Y-%m-%dT%H:%M:%S.%fZ')
    except (ValueError, AttributeError):
        experiment_created_at = None

    sql = 'SELECT date FROM api_dataset WHERE slug=%s'
    params = [exp]
    cursor.execute(sql, params)
    result = cursor.fetchone()
    if result:
        prior_import_date = result[0]
        if process_date_dt <= prior_import_date:
            raise StaleImportError(
                'Process date %s is older than previous import date %s' % (
                    process_date_dt, prior_import_date))

    sql = '''
        INSERT INTO api_dataset
            (name, slug, created_at, date, display, import_start)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    '''
    params = [
        experiment_name,
        'TMP-%s' % exp,  # Store initially with a temporary prefix.
        experiment_created_at,
        process_date_dt,
        False,
        datetime.datetime.now(),
    ]
    if DEBUG_SQL:
        print cursor.mogrify(sql, params)
        return 0
    else:
        cursor.execute(sql, params)
        return cursor.fetchone()[0]


def display_dataset(cursor, exp, dataset_id):
    # Determine if we're replacing a previous import of this experiment.
    old_dataset_id = 0

    sql = 'SELECT id FROM api_dataset WHERE slug=%s'
    params = [exp]
    if DEBUG_SQL:
        print cursor.mogrify(sql, params)
    else:
        cursor.execute(sql, params)
        result = cursor.fetchone()
        if result:
            old_dataset_id = result[0]

    if old_dataset_id:
        # If we are replacing a dataset, we need to delete the old one and
        # update the just added one with the old ID.
        sql = '''
            DELETE FROM api_dataset WHERE id=%s;
            UPDATE api_dataset
              SET id=%s,
                  slug=%s,
                  display=true,
                  import_stop=%s
              WHERE id=%s;
        '''
        params = [
            old_dataset_id,
            old_dataset_id,
            exp,
            datetime.datetime.now(),
            dataset_id,
        ]
    else:
        # This is a new dataset.
        sql = '''
            UPDATE api_dataset
                SET display=true,
                    slug=%s,
                    import_stop=%s
                WHERE id=%s
        '''
        params = [exp, datetime.datetime.now(), dataset_id]

    if DEBUG_SQL:
        print cursor.mogrify(sql, params)
    else:
        cursor.execute(sql, params)


def get_metrics(cursor):
    global METRICS

    if METRICS is not None:
        return METRICS

    sql = 'SELECT id, source_name FROM api_metric'
    cursor.execute(sql)
    METRICS = {r[1]: r[0] for r in cursor.fetchall()}
    return METRICS


def get_metric(cursor, metric_name, metric_type):
    """
    Attempts to get the `metric_id` given the metric source name.

    If not found, creates a new metric.

    """
    metrics = get_metrics(cursor)
    try:
        return metrics[metric_name]
    except KeyError:
        # Not found, create it, setting name=source_name.
        sql = ('INSERT INTO api_metric '
               '(source_name, type, name, description, tooltip, units) '
               'VALUES (%s, %s, %s, %s, %s, %s) '
               'RETURNING id')
        params = [metric_name, metric_type, metric_name, '', '', '']
        if DEBUG_SQL:
            print cursor.mogrify(sql, params)
            return 0
        else:
            cursor.execute(sql, params)
            metric_id = cursor.fetchone()[0]
            # Update METRICS so this new metric is found.
            metrics[metric_name] = metric_id
            return metric_id


def create_collection(cursor, dataset_id, metric_id, num_observations,
                      population, subgroup):
    sql = ('INSERT INTO api_collection '
           '(dataset_id, metric_id, num_observations, population, subgroup) '
           'VALUES (%s, %s, %s, %s, %s) '
           'RETURNING id')
    params = [dataset_id, metric_id, num_observations, population, subgroup]
    if DEBUG_SQL:
        print cursor.mogrify(sql, params)
        return 0
    else:
        cursor.execute(sql, params)
        return cursor.fetchone()[0]


def create_points(cursor, collection_id, histogram):
    params = []
    sql = ('INSERT INTO api_point '
           '(collection_id, bucket, proportion, count, rank) '
           'VALUES %s')

    for rank, k in enumerate(sorted(histogram.keys())):
        v = histogram[k].asDict()
        params.append(
            (collection_id, k, v['pdf'], v['count'], rank)
        )

    if DEBUG_SQL:
        print sql, params
    else:
        execute_values(cursor, sql, params)  # default: page_size=100


def create_stat(cursor, dataset_id, metric_id, population, subgroup, key,
                value):
    sql = ('INSERT INTO api_stats '
           '(dataset_id, metric_id, population, subgroup, key, value) '
           'VALUES (%s, %s, %s, %s, %s, %s) ')
    params = [dataset_id, metric_id, population, subgroup, key, value]
    if DEBUG_SQL:
        print cursor.mogrify(sql, params)
    else:
        cursor.execute(sql, params)


process_date = environ.get('date')
if not process_date:
    # If no date in environment, assume we are running manually and use
    # yesterday's date.
    process_date = (datetime.date.today() -
                    datetime.timedelta(days=1)).strftime('%Y%m%d')

print 'Querying data for date: %s' % process_date

sparkSession = SparkSession.builder.appName('experiments-viewer').getOrCreate()
df = sparkSession.read.parquet(PATH).filter("date='%s'" % process_date).cache()

# Get database connection and initialize logging.
conn = get_database_connection()

# Get list of distinct experiments.
experiments = set(
    [r[0] for r in df.select('experiment_id')
                     .distinct()
                     .collect()]
)

for exp in experiments:

    # Get a fresh cursor, the first command will start the transaction.
    cursor = conn.cursor()

    try:
        dataset_id = create_dataset(cursor, exp, process_date)
        print 'Inserting data for experiment: %s' % exp
    except StaleImportError as e:
        print e
        continue

    # Get all rows for this experiment
    rows = df.filter("experiment_id='%s'" % exp).collect()

    # For each row in the data insert the histograms.
    for row in rows:
        row = row.asDict()

        metric_name = row['metric_name']
        metric_type = row['metric_type']
        population = row['experiment_branch']

        # Some rows contain metadata about the experiment that we store
        # differently.
        if metric_type == 'Metadata':
            stats = row['statistics']
            total_pings = [s['value'] for s in stats
                           if s['name'] == 'Total Pings'][0]
            total_clients = [s['value'] for s in stats
                             if s['name'] == 'Total Clients'][0]
            create_stat(cursor, dataset_id, None, population, '',
                        'total_pings', total_pings)
            create_stat(cursor, dataset_id, None, population, '',
                        'total_clients', total_clients)

            continue

        metric_id = get_metric(cursor, metric_name, metric_type)
        collection_id = create_collection(cursor, dataset_id, metric_id,
                                          row['n'], population,
                                          row['subgroup'] or '')
        create_points(cursor, collection_id, row['histogram'])

    # Flag dataset as viewable.
    display_dataset(cursor, exp, dataset_id)

    # Commit the transaction for this experiment.
    conn.commit()
