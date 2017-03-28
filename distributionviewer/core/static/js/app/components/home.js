import React from 'react';

import ChartListContainer from './containers/chart-list-container';
import ChartMenuContainer from './containers/chart-menu-container';
import Introduction from './views/introduction';


export default function(props) {
  return (
    <div className="home">
      <ChartMenuContainer {...props} />
      <main>
        <Introduction />
        <ChartListContainer {...props} />
      </main>
    </div>
  );
}
