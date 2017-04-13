import React from 'react';
import { Link } from 'react-router';

import DatasetTitleContainer from '../containers/dataset-title-container';
import LogoutButtonContainer from '../containers/logout-button-container';


export default function(props) {
  return (
    <div className="global-wrapper" id="global-wrapper">
      <header className="primary-header">
        <div>
          <h1>
            <Link className="primary-header-link" to={`/?sg=${props.whitelistedSubgroups}&showOutliers=${props.showOutliers}`}>Firefox <em>Experiments</em> Viewer</Link>
          </h1>
        </div>
        <DatasetTitleContainer />
        <LogoutButtonContainer />
      </header>
      <div className="secondary-menu">
        <div className="secondary-menu-content">
          <div className="chart-info" />
        </div>
      </div>
      {/* Pass all props to the child component and render it */}
      {React.cloneElement(props.children, props)}
    </div>
  );
}
