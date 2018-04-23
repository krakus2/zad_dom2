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

  componentDidUpdate(prevProps, prevState){
    console.log("world time did update", prevState.data.cities, this.state.data.cities)
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
