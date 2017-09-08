import React from 'react';


export default class extends React.Component {
  constructor(props) {
    super(props);

    this.toggleSwitch = this.toggleSwitch.bind(this);
  }

  toggleSwitch(evt) {
    function getWrapper(elm) {
      if (elm.classList.contains('switch-wrapper')) {
        return elm;
      }
      return getWrapper(elm.parentNode);
    }

    let switchWrapper = getWrapper(evt.target);
    switchWrapper.querySelector('.switch').classList.toggle('active');

    // React components can only have 1 event listener (of a type) so
    // handle the passed onClick as well.
    this.props.onClick(switchWrapper);
  }

  render() {
    let maybeLabel = null;
    if (this.props.label) {
      maybeLabel = <span className={`population-name ${this.props.populationName}`} title={this.props.countString}>{this.props.label}</span>
    }

    return (
      <div className="switch-wrapper" onClick={this.toggleSwitch}>
        <span className={this.props.active ? 'switch active' : 'switch'}>
          <b className="handle" />
        </span>
        {maybeLabel}
      </div>
    );
  }
}
