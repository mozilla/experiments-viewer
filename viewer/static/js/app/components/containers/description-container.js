import React from 'react';
import striptags from 'striptags';
import nl2br from 'nl2br';

import Description from '../views/description';


export default class extends React.Component {
  cleanUpDescription(rawDescription) {
    let cleanDescription;

    // Remove all tags except for <br> so that they can be replaced with spaces in
    // the next step.
    cleanDescription = striptags(rawDescription, ['br']);

    // Replace all remaining tags (which should just be <br> at this point) with
    // spaces.
    cleanDescription = striptags(cleanDescription, [], ' ');

    return cleanDescription;
  }

  render() {
    if (!this.safeDescription && this.props.rawDescription) {
      this.safeDescription = this.cleanUpDescription(this.props.rawDescription);

      if (this.props.keepLinebreaks) {
        this.safeDescription = nl2br(this.safeDescription);
      }
    }

    return <Description safeDescription={this.safeDescription} asTooltip={this.props.asTooltip} />;
  }
}
