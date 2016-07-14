import React from 'react';
import { LineChart } from 'rd3';

export default function(props) {
  var exampleData = [{
    values : [
      { x: 0,   y: 10 },
      { x: 5,   y: 10 },
      { x: 10,  y: 10 },
      { x: 15,  y: 10 },
      { x: 20,  y: 10 },
      { x: 25,  y: 12 },
      { x: 30,  y: 14 },
      { x: 35,  y: 18 },
      { x: 40,  y: 24 },
      { x: 45,  y: 32 },
      { x: 50,  y: 42 },
      { x: 55,  y: 54 },
      { x: 60,  y: 64 },
      { x: 65,  y: 72 },
      { x: 70,  y: 78 },
      { x: 75,  y: 82 },
      { x: 80,  y: 84 },
      { x: 85,  y: 85 },
      { x: 90,  y: 86 },
      { x: 95,  y: 86 },
      { x: 100, y: 86 },
    ]
  }];

  return  (
    <LineChart
      data={exampleData}

      // General display
      title="Number of available TV channels"
      gridHorizontal={false}
      circleRadius={0}
      width={350}
      height={250}

      // Axes
      domain={{x: [,100], y: [0,100]}}

      // x-axis
      xAxisLabel="channels"
      xAxisTickValues={[0, 5, 100]}

      // y-axis
      yAxisFormatter={tickLabel => tickLabel + '%' }
      yAxisTickValues={[0, 25, 50, 75, 100]}
    />
  );
}
