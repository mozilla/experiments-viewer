# API

## Endpoints

### `GET /metrics/`

Lists the IDs, name, and descriptions of all metrics.

Example output:

```
{
  "metrics": [
    {
      "id": 1,
      "name": "Example",
      "description": "Example metric"
    },
    {
      "id": 2,
      "name": "Another Example",
      "description": "Another example meteric"
    },
    {
      "id": 3,
      "name": "Yet Another Example",
      "description": "Yet another example metric"
    }
  ]
}
```


### `GET /metric/[metric-id]/`

Returns data for a specific metric.

Query parameters:

* `date` (optional): A date in ISO 8601 format. This date will be used to find
  the most recent prior data set.

Example output:

```
{
  "dataSet": "2016-01-01",
  "numObs": 5321560,
  "type": "category",
  "metric": "architecture",
  "points": [
    {
      "p": 0.932504,
      "refRank": 1,
      "b": "x86",
      "c": 0.932504
    },
    {
      "p": 0.0672972,
      "refRank": 2,
      "b": "x86-64",
      "c": 0.999801
    },
    {
      "p": 0.00015503,
      "refRank": 3,
      "b": "missing",
      "c": 0.999956
    },
    {
      "p": 0.0000362676,
      "refRank": 4,
      "b": "arm",
      "c": 0.999992
    },
    {
      "p": 0.00000357038,
      "refRank": 5,
      "b": "sparc",
      "c": 0.999996
    },
    {
      "p": 0.00000432204,
      "refRank": 6,
      "b": "ppc",
      "c": 1
    }
  ]
}
```

#### Field descriptions

<dl>
  <dt>dataSet</dt>
  <dd>
    All metrics are connected to a <code>DataSet</code> which is the date the
    data was created and imported. This allows for historical
    <code>DataSet</code>s to exist.
  </dd>

  <dt>type</dt>
  <dd>
    One of <code>category</code> or <code>numeric</code>. When the type is
    <code>category</code>, <code>points.b</code> will be a string containing a
    word like <i>arm</i> or <i>sparc</i>. When the type is <code>numeric</code>,
    <code>points.b</code> will be a string containing a floating-point number.
  </dd>

  <dt>points</dt>
  <dd>
    <dt>b</dt>
    <dd>
      The bin to which a given amount of weight is assigned
    </dd>

    <dt>p</dt>
    <dd>
      The proportion of weight assigned to that bin (all <code>p</code>s should
      sum to 1)
    </dd>

    <dt>c</dt>
    <dd>
      The cumulative amount of weight if the bins are sorted in
      <code>refRank</code> order
    </dd>

    <dt>refRank</dt>
    <dd>
      The sort order of the bin from the reference population ordered from most
      weight to least weight. This is needed because if you display more than one
      population, the proportion of records bins will be be different, so you need
      a stable ranking to display them side-by-side.
    </dd>
  </dd>
</dl>

#### Other notes

* Data points are gauranteed to be in order, such that the `c` and the `b` (when
  the data is numeric) of an object are always higher than those of the object
  before it.
