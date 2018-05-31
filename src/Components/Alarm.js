import React, { Component } from 'react';
import getDay from 'date-fns/get_day'
import '../Styles/Alarm.css';

class Alarm extends Component {

  state = {
    hour: '',
    repeat: [],
    turnOn: true,
    order: {
      "poniedzialek": 1,
      "wtorek": 2,
      "sroda": 3,
      "czwartek": 4,
      "piatek": 5,
      "sobota": 6,
      "niedziela": 7
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    console.log(nextProps)
      if(nextProps.turnOff !== '' && nextProps.turnOff === prevState.hour && !prevState.repeat.length){
        return {
          turnOn: false
        }
      } else {
        return{
          hour: nextProps.data.hour,
          repeat: nextProps.data.repeat,
          label: nextProps.data.label,
        }
      }

  }

  onToogle = e => {
    let { turnOn, order } = this.state
    const hour = e.target.name.split(" ")[0]
    const repeat = e.target.name.split(" ")[1].split("_")

    if(repeat[0] === "false"){
      const tempObj = {
        hour,
        day: getDay(new Date()),
        turnOn: !turnOn
      }
      this.props.toogleAlarm(tempObj)
    } else {
        const tempObjs = []
        repeat.forEach(elem => {
          const tempObj =
          {
            hour,
            day: order[elem],
            turnOn: !turnOn
          }
          tempObjs.push(tempObj)
        })
        this.props.toogleAlarm(tempObjs)
    }
    turnOn = !turnOn
    this.setState({ turnOn })
  }

  onDelete = (e) => {
    let { turnOn, order } = this.state
    const hour = e.target.name.split(" ")[0]
    const repeat = e.target.name.split(" ")[1].split("_").join(" ")
    this.props.delete({hour, repeat})
  }

  short = (data) => {
    return `${data.slice(0,3)}`
  }

  render() {
    const {hour, repeat, turnOn, label } = this.state
    return (
      <div className="alarm">
        <div className="alarm__line1">
          <div className="alarm__hour">
            {hour}
          </div>
          <input type="checkbox"
            id="alarmOnOFF"
            className="alarmOnOFF"
            checked={turnOn}
            onChange={this.onToogle}
            name={`${hour} ${!!repeat.length && repeat.map(elem => elem).join("_")}`}
          />
          <label className="alarmOnOFFLabel" htmlFor="alarmOnOFF">Toggle</label>
          <button
            className="alarm__deleteButton"
            onClick={this.onDelete}
            name={`${hour} ${!!repeat.length && repeat.map(elem => elem).join("_")}`}>
             &times;
          </button>
        </div>

        <div className="alarm__label">
          {label}
          {!!repeat.length &&
            <span className="alarm__label__repeat">
              <span>Repeat:  </span>
              {repeat.map(elem => this.short(elem)).join(" ")}
            </span>
          }
        </div>

      </div>
    );
  }

}

export default Alarm;
