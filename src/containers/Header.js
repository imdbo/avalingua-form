import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <div className="header-container">
          <div className="header-logo">Avalingua</div>
          <div className="header-menu-left">
          <ul className="Header-right-menu">
            <li className="leftbutton">Español</li>
            <li className="leftbutton">Galego</li>
            <li className="leftbutton">Portugués</li>
            <li className="leftbutton">Inglés</li>
          </ul>
          </div>
          <div className="header-menu-right"></div>
      </div>
    );
  }
}


