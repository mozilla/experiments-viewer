import React from 'react';

export default function(props) {
  return (
    <div className="global-wrapper">
      <header className="primary-header"></header>
      <main>
        {props.children}
      </main>
    </div>
  );
}
