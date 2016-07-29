# API

## Endpoints

* Names and descriptions of all metrics: /metrics/
* Data for a specific metric: /distributions/[metric-name]/

## Output

### /metrics/

```
{
  "metrics": [
    {
      "name": "example",
      "description": "Example metric"
    },
    {
      "name": "anotherExample",
      "description": "Another example meteric"
    },
    {
      "name": "yetAnotherExample",
      "description": "Yet another example metric"
    }
  ]
}
```

### /distributions/[metric-name]/

```
[
  {
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
        "refRank": 6,
        "b": "sparc",
        "c": 0.999996
      },
      {
        "p": 0.00000432204,
        "refRank": 7,
        "b": "ppc",
        "c": 1
      }
    ]
  }
]
```

Where:

* "b" is the bin to which a given amount of weight is assigned
* "p" is for the proportion of weight assigned to that bin (all "p"s should sum
  to 1)
* "c" is for the cumulative amount of weight if the bins are sorted in "refRank"
  order
* "refRank" is the sort order of the bin from the reference population ordered
  from most weight to least weight. This is needed because if you display more
  than one population, the proportion of records bins will be be different, so
  you need a stable ranking to display them side-by-side.
