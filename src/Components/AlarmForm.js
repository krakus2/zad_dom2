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
    label: '',
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
    const { name, textContent }  = e.target
    if(name === 'minute'){
      if(textContent === "+" && this.state[name] < 59){
        this.setState({[name]: this.state[name] + 1})
      } else if (textContent === "-" && this.state[name] > 0){
        this.setState({[name]: this.state[name] - 1})
      } else if(textContent === "-" && this.state[name] === 0){
          this.setState({[name]: 59})
      } else if(textContent === "+" && this.state[name] === 59){
          this.setState({[name]: 0})
      }
    } else if(name === 'hour'){
      if(textContent === "+" && this.state[name] < 23){
        this.setState({[name]: this.state[name] + 1})
      } else if (textContent === "-" && this.state[name] > 0){
        this.setState({[name]: this.state[name] - 1})
      } else if(textContent === "-" && this.state[name] === 0){
          this.setState({[name]: 23})
      } else if(e.target.textContent === "+" && this.state[name] === 23){
          this.setState({[name]: 0})
      }
    }
  }


  onSubmit = e => {
    const objectAlarm = {}
    objectAlarm.hour = `${this.format(this.state.hour)}:${this.format(this.state.minute)}`
    objectAlarm.repeat = [...this.state.repeat]
    //objectAlarm.snooze = this.state.snooze
    objectAlarm.taskToTurnOff = this.state.taskToTurnOff
    objectAlarm.label = !this.state.label.length ? "Alarm" : this.state.label
    this.setState({ repeat: []})
    this.props.onSubmit(objectAlarm)
  }

  short = (data) => {
    return `${data.slice(0,2).toUpperCase()}`
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

  onMouseDown = (e) => {
    const { name, textContent }  = e.target
    console.log(name)
    this.timer = setInterval(() => {
      let data = this.state[name]
      // the function can do whatever you need it to
      if(textContent === '+'){
        if(name === 'hour'){
          if(data < 23 && data >= 0){
            this.setState({ [name]: data + 1})
          } else if (data === 23){
            this.setState({ [name]: 0})
          }
        } else if(name === 'minute' ){
          if(data < 59 && data >= 0){
            this.setState({ [name]: data + 1})
          } else if (data === 59){
            this.setState({ [name]: 0})
          }
        }
      } else if(textContent === '-'){
        if(name === 'hour'){
          if(data <= 23 && data > 0){
            this.setState({ [name]: data - 1})
          } else if (data === 0){
            this.setState({ [name]: 23})
          }
        } else if(name === 'minute' ){
          if(data <= 59 && data > 0){
            this.setState({ [name]: data - 1})
          } else if (data === 0){
            this.setState({ [name]: 59})
          }
        }
      }


    }, 100);
  }

  onMouseUp = () => {
    clearInterval(this.timer);
  }

  onMouseLeave = () => {
    clearInterval(this.timer);
  }

  /*setHour(value){
    this.setState({hour: value})
  }

  setMinute(value){
    this.setState({minute: value})
  }*/ //do wykorzystania jesli zrobie osobny komponent na button

  render() {
    return (
      <div className="alarmForm">
          <div className="alarmForm__buttonRow">
            <button className="buttonPM" name="hour" onClick={this.onClick} onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseLeave}>+</button>
            <button className="buttonPM" name="minute" onClick={this.onClick} onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseLeave}>+</button>
          </div>
          <div className="alarmForm__indicatorRow">
            <input type="text" name="hour" className="inputIndicator" value={this.format(this.state.hour)} onChange={this.onChange} disabled></input> {/*this.format{*/}
            <input type="text" name="minute" className="inputIndicator" value={this.format(this.state.minute)} onChange={this.onChange} disabled></input>
          </div>
          <div className="alarmForm__buttonRow">
            <button className="buttonPM" name="hour" onClick={this.onClick} onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseLeave}>-</button>
            <button className="buttonPM" name="minute" onClick={this.onClick} onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseLeave}>-</button>
          </div>
          <div className="alarmForm__repeatRow" onClick={this.togglePopup}>
            <span className="alarmForm__repeatRow__days">
              {this.state.dayArray.map(elem => (this.state.repeat.some(day => elem === day) ?
                <span className="alarmForm__repeatRow__days--active alarmForm__repeatRow__days" key={elem}>
                  {
                    /*(elem === "sroda" || elem === "piatek") ? `${this.short(elem)}` : */`${this.maxShort(elem)}`
                  }

                </span> :
                <span className="alarmForm__repeatRow__days" key={elem}>
                  {
                    /*(elem === "sroda" || elem === "piatek") ? `${this.short(elem)}` : */`${this.maxShort(elem)}`
                  }
                </span>
              )) }
            </span>
          </div>
          {/*}<div className="alarm__form__snoozeTaskRow" >
            Snooze <input type="checkbox" onClick={this.toggleSnoozeTask} checked={this.state.snooze} name='snooze'></input>
          </div>{*/}
          {/*}<div className="alarmForm__snoozeTaskRow" >
            Math task to turn off <input type="checkbox" onClick={this.toggleSnoozeTask} checked={this.state.taskToTurnOff} name='taskToTurnOff'></input>
          </div>{*/}
          <div className="alarmForm__TaskRow">
            <input className="taskRow__chbox" id="i2" type="checkbox" onClick={this.toggleSnoozeTask} checked={this.state.taskToTurnOff} name='taskToTurnOff'></input>
            <label className="taskRow__label" htmlFor="i2">  Math task to turn off</label>
          </div>
          {/*}<div className="alarmForm__AlarmNameRow" >
            Label <input type="text" onChange={this.updateLabel} value={this.state.label} name="label"
              onClick={this.clearLabel} className="alarmForm__AlarmNameRow__text"></input>
          </div>{*/}
          <div className="alarmForm__AlarmNameRow">
             <input type="text" className="alarmForm__AlarmNameRow__input" required
               onChange={this.updateLabel} value={this.state.label} name="label" onClick={this.clearLabel}></input>
             <span className="highlight"></span>
             <span className="bar"></span>
             <label className="alarmForm__AlarmNameRow__label">Alarm Label</label>
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
