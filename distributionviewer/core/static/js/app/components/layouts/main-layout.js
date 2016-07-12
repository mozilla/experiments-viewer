import React from 'react';
import { Link } from 'react-router';

export default function(props) {
  return (
    <div className="global-wrapper">
      <header className="primary-header">
        <h1><Link className="primary-header-link" to="/">Firefox Distribution Viewer</Link></h1>
      </header>
      <main>
        {props.children}
      </main>
    </div>
  );
}
