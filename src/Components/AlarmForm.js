import React, { Component } from 'react';
import '../Styles/AlarmForm.css';
import { Button } from 'semantic-ui-react'
import Popup from './Popup'

class AlarmForm extends Component {

  state = {
    hour: 12,
    minute: 0,
    repeat: [],
    taskToTurnOff: false,
    snooze: false,
    label: 'Alarm',
    showPopup: false,
    dayArray: ["poniedzialek", "wtorek", "sroda", "czwartek", "piatek", "sobota", "niedziela"]
  }

  togglePopup = () => {
     this.setState({
       showPopup: !this.state.showPopup
     });
   }

  toggleSnoozeTask = (e) => {
    this.setState({
      [e.target.name]: !this.state[e.target.name]
    });
  }

  clearLabel = e => {
    this.setState({ [e.target.name]: ''})
  }

  updateLabel = e => {
    this.setState({ [e.target.name]: e.target.value})
  }

  format = (data) => {
    return data < 10 ? `0${data}` : `${data}`
  }

  onChange = e => {
    if( (e.target.name === 'hour' && Number(e.target.value) <= 23) || (e.target.name === 'minute' && Number(e.target.value) <= 59) ){
      this.setState({ [e.target.name]:  Number(e.target.value) })
    }
  }

  onClick = e => {
    if( (e.target.textContent === "+" && e.target.name === "hour" && this.state[e.target.name] < 23) ||
        (e.target.textContent === "+" && e.target.name === "minute" && this.state[e.target.name] < 59) ){
      this.setState({[e.target.name]: this.state[e.target.name] + 1})
    } else if ((e.target.textContent === "-" && e.target.name === "hour" && this.state[e.target.name] > 0) ||
        (e.target.textContent === "-" && e.target.name === "minute" && this.state[e.target.name] > 0)){
      this.setState({[e.target.name]: this.state[e.target.name] - 1})
    }
  }

  onSubmit = e => {
    const objectAlarm = {}
    objectAlarm.hour = `${this.format(this.state.hour)}:${this.format(this.state.minute)}`
    objectAlarm.repeat = [...this.state.repeat]
    //objectAlarm.snooze = this.state.snooze
    objectAlarm.taskToTurnOff = this.state.taskToTurnOff
    objectAlarm.label = this.state.label
    this.props.onSubmit(objectAlarm)
  }

  short = (data) => {
    return `${data.slice(0,3)}.`
  }

  maxShort = (data) => {
    return `${data.slice(0,1).toUpperCase()}`
  }

  addDays = (data) => {
    this.setState({repeat: data})
  }

  componentDidMount() {
    const date = new Date();
    this.setState({ hour: date.getHours(), minute: date.getMinutes() })
  }

  render() {
    return (
      <div className="alarmForm">
          <div className="alarmForm__buttonRow">
            <button className="buttonPM" name="hour" onClick={this.onClick} >+</button>
            <button className="buttonPM" name="minute" onClick={this.onClick}>+</button>
          </div>
          <div className="alarmForm__indicatorRow">
            <input type="text" name="hour" className="inputIndicator" value={this.format(this.state.hour)} onChange={this.onChange}></input>
            <input type="text" name="minute" className="inputIndicator" value={this.format(this.state.minute)} onChange={this.onChange}></input>
          </div>
          <div className="alarmForm__buttonRow">
            <button className="buttonPM" name="hour" onClick={this.onClick}>-</button>
            <button className="buttonPM" name="minute" onClick={this.onClick}>-</button>
          </div>
          <div className="alarmForm__repeatRow" onClick={this.togglePopup}>
            <span className="alarmForm__repeatRow__days">
              {this.state.dayArray.map(elem => (this.state.repeat.some(day => elem === day) ?
                <span className="alarmForm__repeatRow__days--active alarmForm__repeatRow__days">
                  {`${this.maxShort(elem)}`}
                </span> :
                <span className="alarmForm__repeatRow__days">
                  {`${this.maxShort(elem)}`}
                </span>
              )) }
            </span>
          </div>
          {/*}<div className="alarm__form__snoozeTaskRow" >
            Snooze <input type="checkbox" onClick={this.toggleSnoozeTask} checked={this.state.snooze} name='snooze'></input>
          </div>{*/}
          <div className="alarmForm__snoozeTaskRow" >
            Math task to turn off <input type="checkbox" onClick={this.toggleSnoozeTask} checked={this.state.taskToTurnOff} name='taskToTurnOff'></input>
          </div>
          <div className="alarmForm__AlarmNameRow" >
            Label <input type="text" onChange={this.updateLabel} value={this.state.label} name="label"
              onClick={this.clearLabel} className="alarmForm__AlarmNameRow__text"></input>
          </div>
          <button className="buttonPM buttonSubmit" onClick={this.onSubmit}>Add alarm</button>
          {this.state.showPopup ?
          <Popup
            closePopup={this.togglePopup}
            unMount={this.addDays}
            repeat={this.state.repeat}
          />
          : null
        }
      </div>
    );
  }

}

export default AlarmForm;
