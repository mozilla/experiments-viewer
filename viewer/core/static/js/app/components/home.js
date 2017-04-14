import React from 'react';

import ChartList from './views/chart-list';


export default function(props) {
  return (
    <div className="home">
      <main>
        <ChartList {...props} />
      </main>
    </div>
  );
}
