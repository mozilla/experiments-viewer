import React from 'react';
import { Link } from 'react-router';

import DateRangeContainer from '../containers/date-range-container';


export default function MainLayout(props) {
  return (
    <div className="global-wrapper" id="global-wrapper">
      <header className="primary-header">
        <h1><Link className="primary-header-link" to="/">Firefox Distribution Viewer</Link></h1>
        <DateRangeContainer />
        <div className="sign-in-wrapper" />
      </header>
      <nav className="filters">
        <ul>
          <li><a href="#">OS by Version</a></li>
          <li><a href="#">Update Channel</a></li>
          <li><a href="#">Firefox Version</a></li>
          <li><a href="#">CPU Count</a></li>
          <li><a href="#">System Memory</a></li>
        </ul>
      </nav>
      {props.children}
    </div>
  );
}

MainLayout.propTypes = {
  children: React.PropTypes.node.isRequired,
}
