import boto3
import psycopg2
import ujson
from pyspark.sql.functions import cume_dist, row_number
from pyspark.sql.window import Window

"""
TODO Migrations:
    * Add date range table for weekly distributions
    * Add 'type' field for metric for categorical vs numerical
    * Add 'raw_name' field for the metric's name in the raw data source
"""
# TODO: Get real parquet data.
df = sqlContext.read.json("/Users/rob/sample.json")
total_count = df.count()

# TODO: Send db credentials to mreid to set up.
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
cur.execute('SELECT * FROM api_metric')
metrics = cur.fetchall()

# TODO: Find a place for a key mapping our metric name to that stored in source
# parquet data set.
for metric in metrics:
    (metric_id, metric_name, metric_descr, metric_metadata,
     metric_type, metric_raw_name) = metric

    if metric_type == 'categorical':

        totals = (df.groupBy(metric_raw_name)
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

        num_partitions = total_count / 500
        ws = Window.orderBy(metric_raw_name)
        cdf = df.select(
            df[metric_raw_name],
            cume_dist().over(ws).alias('c'),
            row_number().over(ws).alias('i'))
        partitioned_cdf = cdf.filter("i = 1 OR i %% %d = 0" % num_partitions)

        # Clean up data:
        #   * Collapse any rows that contain duplicate bins
        #       - if bin is the same as previous bin, overwrite it
        #   * Calculate 'p' from 'c'.
