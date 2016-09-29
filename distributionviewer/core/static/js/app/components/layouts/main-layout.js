import React from 'react';
import { Link } from 'react-router';

import DatasetDatestampContainer from '../containers/dataset-datestamp-container';
import LogoutButtonContainer from '../containers/logout-button-container';


export default function(props) {
  return (
    <div className="global-wrapper" id="global-wrapper">
      <header className="primary-header">
        <h1><Link className="primary-header-link" to="/">Firefox Distribution Viewer</Link></h1>
        <DatasetDatestampContainer />
        <LogoutButtonContainer />
      </header>
      {props.children}
    </div>
  );
}
