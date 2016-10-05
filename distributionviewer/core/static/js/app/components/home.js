import React from 'react';
import ChartListContainer from './containers/chart-list-container';
import ChartMenuContainer from './containers/chart-menu-container';


export default function(props) {
  return (
    <main>
      <ChartMenuContainer query={props.location.query} />
      <ChartListContainer query={props.location.query} />
    </main>
  );
}
