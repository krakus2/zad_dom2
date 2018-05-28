import React, { Component } from 'react';
import '../Styles/Popup.css';

class Popup2 extends React.Component {

  render() {
    return (
      <div className='popup'>
        <div className='popup__inner'>
          "No elo"
          {this.props.mathTask && "Działa chuju"}
        <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}

export default Popup2;
