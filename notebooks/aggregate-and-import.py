import boto3
import psycopg2
import ujson
from pyspark.sql.functions import cume_dist, row_number
from pyspark.sql.window import Window

"""
TODO Migrations:
    * Add date range table for weekly distributions (issue #62)
"""
# TODO: Get real parquet data.
df = sqlContext.read.json("/Users/rob/sample.json")

# Set up database connection to shielddash.
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
cur = conn.cursor()


# Get the metrics we need to gather data for.
cur.execute('SELECT id, name, description, source_name, type FROM api_metric')
metrics = cur.fetchall()

for metric in metrics:
    metric_id, metric_name, metric_descr, metric_type, metric_src = metric

    if metric_type == 'categorical':

        totals = (df.groupBy(metric_src)
                    .count()
                    .sort('count', ascending=False)
                    .collect())
        observations = sum([t[1] for t in totals])
        data = [{
            k: v for (k, v) in zip(
                ['bucket', 'count', 'proportion'],
                [t[0], t[1], round(t[1] / float(observations), 4)])
        } for t in totals]
        """
        Example categorical data::

            [{'count': 757725, 'bucket': u'Windows_NT', 'p': 0.9379},
             {'count': 48409,  'bucket': u'Darwin',     'p': 0.0599},
             {'count': 1122,   'bucket': u'Linux',      'p': 0.0014},
             {'count': 591,    'bucket': u'NaN',        'p': 0.0007},
             {'count': 4,      'bucket': u'Windows_95', 'p': 0.0},
             {'count': 3,      'bucket': u'Windows_98', 'p': 0.0},
             {'count': 1,      'bucket': u'__MISSING',  'p': 0.0}]
        """

        # Push data to database.
        sql = """
            INSERT INTO api_categorycollection
                (num_observations, population, metric_id)
            VALUES (%s, 'channel_release', %d)
        """
        cur.execute(sql, observations, metric_id)
        collection_id = cur.lastrowid

        for i, d in enumerate(data):
            sql = """
                INSERT INTO api_categorypoint
                    (bucket, proportion, rank, collection_id)
                VALUES (%s, %f, %d, %d)
            """
            cur.execute(sql, d['bucket'], d['proportion'], i, collection_id)

    elif metric_type == 'numerical':

        cdf = df.select(df[metric_src])
        cdf = cdf.filter("%s != 'NaN'" % metric_src)
        cdf = cdf.select(cdf[metric_src].cast('float').alias('bucket'))

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

        # Calculate `p` from `c`, and add a `rank` column.
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

            [{'bucket': 0.0, 'c': 0.00126056, 'p': 0.00126056},
             {'bucket': 3.0, 'c': 0.00372313, 'p': 0.00246256},
             {'bucket': 4.0, 'c': 0.00430616, 'p': 0.0005830290622683026},
             {'bucket': 6.13319683, 'c': 0.00599801, 'p': 0.00169184},
             {'bucket': 8.0, 'c': 0.08114486, 'p': 0.07514685},
             {'bucket': 8.23087882, 'c': 0.08197282, 'p': 0.00082795},
             ...]
         """

        # Push data to database.
        sql = """
            INSERT INTO api_logcollection
                (num_observations, population, metric_id)
            VALUES (%s, 'channel_release', %d)
        """
        cur.execute(sql, total_count, metric_id)
        collection_id = cur.lastrowid

        for d in data:
            sql = """
                INSERT INTO api_logpoint (bucket, proportion, collection_id)
                VALUES (%f, %f, %d)
            """
            cur.execute(sql, d['bucket'], d['p'], collection_id)
