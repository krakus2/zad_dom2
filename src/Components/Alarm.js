import React, { Component } from 'react';
import MyMenu from './MyMenu'
import AlarmForm from './AlarmForm'
import '../Styles/Alarm.css';

class Alarm extends Component {

  state = {
    alarms: [],
    errors: {}
  }

onSubmitForm = (alarm) => {
  const alarms = [...this.state.alarms]
  if(alarms.includes(alarm) === false){
    alarms.push(alarm)
    const errors = {}
    errors.duplicate = false
    this.setState({ alarms, errors })
  } else {
    const errors = {}
    errors.duplicate = true
    this.setState({ errors })
  }
}

  render() {
    return (
      <div className="alarm">
        <MyMenu active="alarm"/>
        <AlarmForm onSubmit={this.onSubmitForm}/>

      </div>
    );
  }

}

export default Alarm;
