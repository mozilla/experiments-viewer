import React from 'react';
import { Link } from 'react-router';
import ExampleDateRangeContainer from '../containers/example-date-range-container';

export default function(props) {
  return (
    <div className="global-wrapper">
      <nav className="filters">
        <ul>
          <li><a href="#">OS by Version</a></li>
          <li><a href="#">Update Channel</a></li>
          <li><a href="#">Firefox Version</a></li>
          <li><a href="#">CPU Count</a></li>
          <li><a href="#">System Memory</a></li>
        </ul>
      </nav>
      <div id="content">
        <header className="primary-header">
          <h1><Link className="primary-header-link" to="/">Firefox Distribution Viewer</Link></h1>
          <ExampleDateRangeContainer />        
        </header>
        {props.children}
      </div>
    </div>
  );
}
