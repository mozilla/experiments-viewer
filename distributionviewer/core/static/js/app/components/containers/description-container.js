import React from 'react';
import striptags from 'striptags';
import nl2br from 'nl2br';

import Description from '../views/description';


export default class extends React.Component {
  render() {
    if (!this.safeDescriptionWithLinebreaks && this.props.rawDescription) {
      this.safeDescriptionWithLinebreaks = nl2br(striptags(this.props.rawDescription));
    }

    return <Description safeDescription={this.safeDescriptionWithLinebreaks} />;
  }
}
