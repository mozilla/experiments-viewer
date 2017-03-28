import React from 'react';


export default function(props) {
  return (
    <section className="introduction">
      <p>
        The following plots are lightly processed <a
        href="http://en.wikipedia.org/wiki/Empirical_distribution_function">empirical
        cumulative distribution functions</a> of a number of key measures from a
        1% sample of Firefox clients. Data is updated weekly.
      </p>

      <p>
        For help reading CDFs, take a look at these guides from <a
        href="http://ukclimateprojections.metoffice.gov.uk/22619">UK Climate
        Projections</a> and <a href="http://docs.battlemesh.org/v8/ecdf.html">the
        Battlemesh project</a>. The key thing to remember is that places where the
        curve is very steep represent parts of the x-axis with many observations.
      </p>

      <p>
        If you have any questions about how to interpret these charts, where the
        data came from and how it was processed, or suggestions or requests,
        please send a Slack message or email to <a
        href="mailto:bcolloran@mozilla.com">bcolloran@mozilla.com</a>.
      </p>
    </section>
  );
}
