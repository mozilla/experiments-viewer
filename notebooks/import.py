import datetime
import logging
import sys

import boto3
import psycopg2
import ujson
from psycopg2.extras import LoggingConnection
from pyspark.sql import SparkSession


PATH = 's3://telemetry-test-bucket/experiments_analysis/'
LOG_LEVEL = logging.INFO  # Change to incr/decr logging output.
DEBUG_SQL = False  # Set to True to not insert any data.
METRICS = None


logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger(__name__)


def get_database_connection():
    global logger

    s3 = boto3.resource('s3')
    metasrcs = ujson.load(
        s3.Object('net-mozaws-prod-us-west-2-pipeline-metadata',
                  'sources.json').get()['Body'])
    creds = ujson.load(
        s3.Object('net-mozaws-prod-us-west-2-pipeline-metadata',
                  '%s/write/credentials.json' % (
                      metasrcs['experiments-viewer-db']['metadata_prefix'],
                  )).get()['Body'])
    conn = psycopg2.connect(connection_factory=LoggingConnection,
                            host=creds['host'], port=creds.get('port', 5432),
                            user=creds['username'], password=creds['password'],
                            dbname=creds['db_name'])
    conn.initialize(logger)
    return conn, conn.cursor()


def create_dataset(exp):
    sql = ('INSERT INTO api_dataset (name, date, display, import_start) '
           'VALUES (%s, %s, %s, %s) '
           'RETURNING id')
    params = [
        exp,
        datetime.date.today(),
        False,
        datetime.datetime.now(),
    ]
    if DEBUG_SQL:
        print cursor.mogrify(sql, params)
        return 0
    else:
        cursor.execute(sql, params)
        conn.commit()
        return cursor.fetchone()[0]


def display_dataset(dataset_id):
    sql = 'UPDATE api_dataset SET display=true WHERE id=%s'
    params = [dataset_id]
    if DEBUG_SQL:
        print cursor.mogrify(sql, params)
    else:
        cursor.execute(sql, params)
        conn.commit()


def get_metrics():
    global METRICS

    if METRICS is not None:
        return METRICS

    sql = 'SELECT id, source_name FROM api_metric'
    cursor.execute(sql)
    METRICS = {r[1]: r[0] for r in cursor.fetchall()}
    return METRICS


def get_metric(metric_name, metric_type):
    """
    Attempts to get the `metric_id` given the metric source name.

    If not found, creates a new metric.

    """
    metrics = get_metrics()
    try:
        return metrics[metric_name]
    except KeyError:
        # Not found, create it, setting name=source_name.
        sql = ('INSERT INTO api_metric '
               '(source_name, type, name, description, tooltip) '
               'VALUES (%s, %s, %s, %s, %s) '
               'RETURNING id')
        params = [metric_name, metric_type, metric_name, '', '']
        if DEBUG_SQL:
            print cursor.mogrify(sql, params)
            return 0
        else:
            cursor.execute(sql, params)
            conn.commit()
            metric_id = cursor.fetchone()[0]
            # Update METRICS so this new metric is found.
            metrics[metric_name] = metric_id
            return metric_id


def create_collection(dataset_id, metric_id, num_observations, population,
                      subgroup):
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
        conn.commit()
        return cursor.fetchone()[0]


def create_point(collection_id, bucket, proportion, count, rank):
    sql = ('INSERT INTO api_point '
           '(collection_id, bucket, proportion, count, rank) '
           'VALUES (%s, %s, %s, %s, %s) ')
    params = [collection_id, bucket, proportion, count, rank]
    if DEBUG_SQL:
        print cursor.mogrify(sql, params)
    else:
        cursor.execute(sql, params)


sparkSession = SparkSession.builder.appName('experiments-viewer').getOrCreate()
df = sparkSession.read.parquet(PATH)

# Get database connection and initialize logging.
conn, cursor = get_database_connection()

# Get list of distinct experiments.
experiments = set([r[0] for r in
                   df.select('experiment_id').distinct().collect()])

# Check list of experiments against what we have in the database.
# If there's a new one, import it.
sql = 'SELECT name FROM api_dataset'
cursor.execute(sql)
db_experiments = set([r[0] for r in cursor.fetchall()])

missing = list(experiments - db_experiments)
if not missing:
    print('No new experiments found. Exiting.')
    sys.exit()


for exp in missing:
    print 'Inserting data for new experiment: %s' % exp
    dataset_id = create_dataset(exp)

    # Get all rows for this experiment
    rows = df.filter("experiment_id='%s'" % exp).collect()

    # For each row in the data insert the histograms.
    for row in rows:
        row = row.asDict()

        metric_id = get_metric(row['metric_name'], row['metric_type'])
        collection_id = create_collection(
            dataset_id, metric_id, row['n'], row['experiment_branch'],
            row['subgroup'] or '')

        for rank, kv in enumerate(row['histogram'].iteritems(), 1):
            k, v = kv[0], kv[1].asDict()
            create_point(collection_id, k, v['pdf'], v['count'], rank)
        conn.commit()

        # TODO: Store row['statistics']

    # Flag dataset as viewable.
    display_dataset(dataset_id)
