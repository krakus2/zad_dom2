import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Counter from './Timer'
import TimerForm from './TimerForm'
import MyMenu from './MyMenu'
//import './Styles/App.css'


class TimerPageTwo extends Component {
  state = {
    data: {
      from: 0,
      to: 0,
      success: false
    }
  }

  changeState = (time) => {
    console.log("change state")
    this.setState({
      data: {...this.state.data, from: time.from, to: time.to, success: false}
    })
  }

  onSuccess = () => {
    console.log("Sukces")
    /*let { success } = this.state.data
    success = true;*/
    this.setState({ data: {...this.state.data, success: true} })
  }

  render() {
    const { data } = this.state
    const style = {
      backgroundColor: data.success ? 'yellow' : 'white'
    }
    return (
        <div className="ui container" style={style}>
          <MyMenu active="timer"/>
          <TimerForm changeState={this.changeState}/>
          <Counter from={Number(data.from)} to={Number(data.to)} onSuccess={this.onSuccess}/>
        </div>
    );
  }
}

export default TimerPageTwo;
