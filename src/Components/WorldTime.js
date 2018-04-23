import React, { Component } from 'react';
import MyMenu from './MyMenu'
import WorldTimeForm from './WorldTimeForm'

class WorldTime extends Component {
  state = {
    data: {
      cities: []
    }
  }

  changeState = (data) => {
    console.log(data)
    this.setState({
      data: { cities: data }
    })
  }

  render() {
    return (
      <div className='WorldTime'>
        <MyMenu active="worldtime"/>
        <WorldTimeForm changeState={this.changeState}/>
      </div>
    );
  }
}

export default WorldTime;
