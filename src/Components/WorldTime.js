import React, { Component } from 'react';
import MyMenu from './MyMenu'
import WorldTimeForm from './WorldTimeForm'

class WorldTime extends Component {
  render() {
    return (
      <div className='WorldTime'>
        <MyMenu active="worldtime"/>
        <WorldTimeForm />
      </div>
    );
  }
}

export default WorldTime;
