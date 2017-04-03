import React from 'react';

import ChartListContainer from './containers/chart-list-container';


export default function(props) {
  return (
    <div className="home">
      <main>
        <ChartListContainer {...props} />
      </main>
    </div>
  );
}
