# API

## Endpoints


### `GET /datasets/`

Lists the ID and name of all datasets, and associated populations for each.

Example output:

```
{
  "datasets": [
    {
      "id": 1,
      "name": "Experiment 1",
      "slug": "experiment-1",
      "date": "2017-01-01",
      "metrics": [1, 2, 3, 4, 5],
      "populations": {
        "control": {
          "total_pings": 12345,
          "total_clients": 1234
        },
        "group A": {
          "total_pings": 23456,
          "total_clients": 2345
        }
      },
      "subgroups": ["Windows", "Linux", "Mac"]
    },
    {
      "id": 2,
      "name": "Experiment 2",
      "slug": "experiment-2",
      "date": "2017-02-01",
      "metrics": [2, 4, 6, 7, 8, 9],
      "populations": {
        "control": {
          "total_pings": 12345,
          "total_clients": 1234
        },
        "group A": {
          "total_pings": 23456,
          "total_clients": 2345
        }
      },
      "subgroups": ["Windows", "Linux", "Mac"]
    }
  ]
}
```


### `GET /metrics/`

Lists the IDs, name, and descriptions of all metrics.

Query parameters:

* `ds` (optional): This string, representing the dataset ID, will be used to
  filter the metrics found within the given dataset. If not provided, the API
  will return all metrics across all datasets.

Example output:

```
{
  "metrics": [
    {
      "id": 1,
      "name": "CPU Architecture",
      "description": "The architecture of the client machine"
      "tooltip": "{y}% of all {pop} records have {x} architecture",
      "type": "FlagHistogram",
      "units": ""
    },
    {
      "id": 2,
      "name": "CPU Count",
      "description": "The number of CPUs available"
      "tooltip": "{p}% of all {pop} records have {x} or more CPUs",
      "type": "CountHistogram",
      "units": "CPUs"
    },
    ...
  ]
}
```


### `GET /metric/[metric-id]/`

Returns data for a specific metric, grouped by the population, if provided.

Query parameters:

* `ds` (optional): This string, representing the dataset name, will be used to
  find the `DataSet` (aka experiment). If none provided this will default to
  the most recently added experiment.
* `pop` (optional): A comma separated list of populations. If none provided,
  all populations will be returned.
* `sg` (optional)`: A string that will filter the data by the provided
  subgroup.  If none provided, the "All" subgroup will be returned.

Example output:

```
{
  "id": 1,
  "dataSet": "experiment-1",
  "type": "FlagHistogram",
  "name": "CPU Architecture",
  "subgroup": "Windows",
  "populations": [
    {
      "name": "control",
      "numObs": 5321560,
      "points": [
        {
          "p": 0.932504,
          "refRank": 1,
          "b": "x86",
          "c": 345
        },
        {
          "p": 0.0672972,
          "refRank": 2,
          "b": "x86-64",
          "c": 234
        },
        {
          "p": 0.00015503,
          "refRank": 3,
          "b": "missing",
          "c": 123
        },
        {
          "p": 0.0000362676,
          "refRank": 4,
          "b": "arm",
          "c": 23
        },
        {
          "p": 0.00000357038,
          "refRank": 5,
          "b": "sparc",
          "c": 12
        },
        {
          "p": 0.00000432204,
          "refRank": 6,
          "b": "ppc",
          "c": 1
        }
      ]
    },
    ...
  ]
}
```

#### Field descriptions

<dl>
  <dt>dataSet</dt>
  <dd>
    All metrics are connected to a <code>DataSet</code> which is the experiment
    from which the data was created and imported.
  </dd>

  <dt>type</dt>
  <dd>
    The type of metric, e.g. "CountHistogram".
  </dd>

  <dt>subgroup</dt>
  <dd>
    The subgroup of the data, e.g. "Windows".
  </dd>

  <dt>populations.name</dt>
  <dd>
    The population this data set applies to.
  </dd>

  <dt>points</dt>
  <dd>
    <dl>
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
        The count of records belonging to bin <code>b</code>
      </dd>

      <dt>refRank</dt>
      <dd>
        The sort order of the bin from the reference population ordered from most
        weight to least weight. This is needed because if you display more than one
        population, the proportion of records bins will be be different, so you need
        a stable ranking to display them side-by-side.
      </dd>
    </dl>
  </dd>
</dl>

#### Other notes

* Data points are guaranteed to be in order, such that the `b` of an object are
  always higher than those of the object before it.
