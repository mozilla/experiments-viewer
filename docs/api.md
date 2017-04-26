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
      "populations": ["control", "group A"]
    },
    {
      "id": 2,
      "name": "Experiment 2",
      "populations": ["control", "group A"]
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
      "type": "FlagHistogram"
    },
    {
      "id": 2,
      "name": "CPU Count",
      "description": "The number of CPUs available"
      "tooltip": "{p}% of all {pop} records have {x} or more CPUs",
      "type": "CountHistogram"
    },
    ...
  ]
}
```


### `GET /metric/[metric-id]/`

Returns data for a specific metric, grouped by the population, if provided.

Query parameters:

* `ds` (optional): This string, representing the dataset ID, will be used to
  find the `DataSet` (aka experiment). If none provided this will default to
  the most recently added experiment.
* `pop` (optional): A comma separated list of populations. If none provided,
  this will default to "All".

Example output:

```
{
  "id": 1,
  "dataSet": "Experiment A",
  "type": "FlagHistogram",
  "name": "CPU Architecture",
  "populations": [
    {
      "name": "All",
      "numObs": 5321560,
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

  <dt>populations.name</dt>
  <dd>
    The population this data set applies to. Besides "All", some examples
    include: "control" or "group-a".
  </dd>

  <dt>type</dt>
  <dd>
    The type of metric, e.g. "CountHistogram".
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

* Data points are guaranteed to be in order, such that the `c` and the `b` (when
  the data is numerical) of an object are always higher than those of the object
  before it.
