import React, { Component } from 'react';

export default class Header extends Component {

  render() {
    return (
      <div className="header-container">
          <div className="header-logo">Avalingua</div>
          <div className="header-menu-left">
          <ul className="Header-right-menu">
            <li id="Formulario" className="leftbutton"  onClick={e=>this.props.selector(e.target.id)}>Formulario</li>
            <li id = "Bateria" className="leftbutton" onClick={e=>this.props.selector(e.target.id)}>Demostrador</li>
            <li id = "Settings" className="leftbutton" onClick={e=>this.props.selector(e.target.id)}>Settings</li>
          </ul>
          </div>
          <div className="header-menu-right"></div>
      </div>
    );
  }
}