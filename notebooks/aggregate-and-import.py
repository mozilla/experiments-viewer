import datetime
from os import environ

import boto3
import psycopg2
import ujson
from pyspark.sql import SparkSession
from pyspark.sql.functions import cume_dist, row_number
from pyspark.sql.window import Window


sparkSession = SparkSession.builder.appName('distribution-viewer').getOrCreate()


PARQUET_PATH = 's3://telemetry-parquet/cross_sectional/v%s' % environ['date']
DEBUG_SQL = False  # If True, prints the SQL instead of executing it.


def get_database_connection():
    s3 = boto3.resource('s3')
    metasrcs = ujson.load(
        s3.Object('net-mozaws-prod-us-west-2-pipeline-metadata',
                  'sources.json').get()['Body'])
    creds = ujson.load(
        s3.Object('net-mozaws-prod-us-west-2-pipeline-metadata',
                  '%s/write/credentials.json' % (
                      metasrcs['distribution-viewer-db']['metadata_prefix'],
                  )).get()['Body'])
    conn = psycopg2.connect(host=creds['host'], port=creds['port'],
                            user=creds['username'], password=creds['password'],
                            dbname=creds['db_name'])
    return conn, conn.cursor()


def collect_categorical_metric(metric, df, population):
    cdf = df.select(df[metric['src']])
    cdf = cdf.dropna(subset=metric['src'])
    totals = (cdf.groupBy(metric['src'])
                 .count()
                 .sort('count', ascending=False)
                 .collect())
    observations = sum([t[1] for t in totals])
    data = [{
        k: v for (k, v) in zip(
            ['bucket', 'count', 'proportion'],
            [t[0], t[1], round(t[1] / float(observations), 8)])
    } for t in totals]
    """
    Example categorical data::

        [{'bucket': u'Windows_NT', 'count': 757725, 'proportion': 0.93863462},
         {'bucket': u'Darwin',     'count': 48409,  'proportion': 0.05996683},
         {'bucket': u'Linux',      'count': 1122,   'proportion': 0.00138988},
         {'bucket': u'Windows_95', 'count': 4,      'proportion': 4.96e-06},
         {'bucket': u'Windows_98', 'count': 3,      'proportion': 3.72e-06}]
    """
    # Push data to database.
    sql = ("INSERT INTO api_categorycollection "
           "(num_observations, population, metric_id, dataset_id) "
           "VALUES (%s, %s, %s, %s) "
           "RETURNING id")
    params = [observations, population, metric['id'], dataset_id]
    if DEBUG_SQL:
        collection_id = 0
        print sql, params
    else:
        cursor.execute(sql, params)
        conn.commit()
        collection_id = cursor.fetchone()[0]

    for i, d in enumerate(data):
        sql = ("INSERT INTO api_categorypoint "
               "(bucket, proportion, rank, collection_id) "
               "VALUES (%s, %s, %s, %s)")
        params = [d['bucket'], d['proportion'], i + 1, collection_id]
        if DEBUG_SQL:
            print sql, params
        else:
            cursor.execute(sql, params)

    if not DEBUG_SQL:
        conn.commit()


def collect_numeric_metric(metric, df, population):
    cdf = df.select(df[metric['src']])
    cdf = cdf.dropna(subset=metric['src'])
    cdf = cdf.select(cdf[metric['src']].cast('float').alias('bucket'))

    total_count = cdf.count()
    num_partitions = total_count / 500
    ws = Window.orderBy('bucket')
    cdf = cdf.select(
        cdf['bucket'],
        cume_dist().over(ws).alias('c'),
        row_number().over(ws).alias('i'))
    cdf = cdf.filter("i = 1 OR i %% %d = 0" % num_partitions)
    cdf = cdf.collect()

    # Collapse rows with duplicate buckets.
    collapsed_data = []
    prev = None
    for d in cdf:
        if not collapsed_data:
            collapsed_data.append(d)  # Always keep first record.
            continue
        if prev and prev['bucket'] == d['bucket']:
            collapsed_data.pop()
        collapsed_data.append(d)
        prev = d

    # Calculate `p` from `c`.
    data = []
    prev = None
    for i, d in enumerate(collapsed_data):
        p = d['c'] - prev['c'] if prev else d['c']
        data.append({
            'bucket': d['bucket'],
            'c': d['c'],
            'p': p,
        })
        prev = d
    """
    Example of what `data` looks like now::

        [{'bucket': 0.0,        'c': 0.00126056, 'p': 0.00126056},
         {'bucket': 3.0,        'c': 0.00372313, 'p': 0.00246256},
         {'bucket': 4.0,        'c': 0.00430616, 'p': 0.0005830290622683026},
         {'bucket': 6.13319683, 'c': 0.00599801, 'p': 0.00169184},
         {'bucket': 8.0,        'c': 0.08114486, 'p': 0.07514685},
         {'bucket': 8.23087882, 'c': 0.08197282, 'p': 0.00082795},
         ...]
    """
    # Push data to database.
    sql = ("INSERT INTO api_numericcollection "
           "(num_observations, population, metric_id, dataset_id) "
           "VALUES (%s, %s, %s, %s) "
           "RETURNING id")
    params = [total_count, population, metric['id'], dataset_id]
    if DEBUG_SQL:
        collection_id = 0
        print sql, params
    else:
        cursor.execute(sql, params)
        conn.commit()
        collection_id = cursor.fetchone()[0]

    for d in data:
        sql = ("INSERT INTO api_numericpoint "
               "(bucket, proportion, collection_id) "
               "VALUES (%s, %s, %s)")
        params = [d['bucket'], d['p'], collection_id]
        if DEBUG_SQL:
            print sql, params
        else:
            cursor.execute(sql, params)

    if not DEBUG_SQL:
        conn.commit()


def calculate_population(metrics, df, name):
    for metric_row in metrics:
        m_id, m_type, m_src = metric_row
        metric = {
            'id': m_id,
            'src': m_src,
        }
        if m_type == 'C':
            collect_categorical_metric(metric, df, name)
        elif m_type == 'N':
            collect_numeric_metric(metric, df, name)


df = sparkSession.read.parquet(PARQUET_PATH)

# Set up database connection to distribution viewer.
conn, cursor = get_database_connection()

# Create a new dataset for this import.
sql = ("INSERT INTO api_dataset (date, display, import_start) "
       "VALUES (%s, %s, %s) RETURNING id")
params = [datetime.date.today(), False, datetime.datetime.now()]
if DEBUG_SQL:
    dataset_id = 0
    print sql, params
else:
    cursor.execute(sql, params)
    conn.commit()
    dataset_id = cursor.fetchone()[0]

# Get the metrics we need to gather data for.
cursor.execute('SELECT id, type, source_name FROM api_metric')
metrics = cursor.fetchall()

# Define the populations we are filtering by.
# Cache the channel filtered datasets to not recompute each time.
release_df = df.filter("normalized_channel = 'release'").cache()
beta_df = df.filter("normalized_channel = 'beta'").cache()
aurora_df = df.filter("normalized_channel = 'aurora'").cache()
nightly_df = df.filter("normalized_channel = 'nightly'").cache()

populations = [(release_df, 'channel:release'),
               (beta_df, 'channel:beta'),
               (aurora_df, 'channel:aurora'),
               (nightly_df, 'channel:nightly')]

# Calculation 'All' metric first.
calculate_population(metrics, df, 'All')

# Next do defined populations.
for pop_df, pop_name in populations:
    calculate_population(metrics, pop_df, pop_name)

# Now that we're done update the api_dataset table to display this data.
sql = "UPDATE api_dataset SET display=%s, import_end=%s WHERE id=%s"
params = [True, datetime.datetime.now(), dataset_id]
if DEBUG_SQL:
    print sql, params
else:
    cursor.execute(sql, params)
    conn.commit()

# We're done. Close the door on the way out.
sparkSession.stop()
