import React, { Component } from 'react';
import MyMenu from './MyMenu'
import AlarmForm from './AlarmForm'
import '../Styles/Alarms.css';
import getDay from 'date-fns/get_day'
import Alarm from './Alarm'


class Alarms extends Component {

  state = {
    alarms: [],
    errors: {},
    turnOnAlarms: [],
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

  //posortowac daty chronologicznie (ale nie za pomoca calych dat, tylko godzin i dni tygodnia)
  //i sprawdzac co sekunde (minute?) czy czas ogolny sie zgadza z czasem budzika
  //jesli tak to wyskakuje popup z zadaniem i drzemka
  //jesli klikne drzemke to dodaje ja do kolejki posrotowanych budzikow

 onSubmitForm = (alarm) => {
    const alarms = [...this.state.alarms]
    const turnOnAlarms = [...this.state.turnOnAlarms]
    const { order } = this.state
    alarm.turnOn = true

    if(alarm.repeat.length){
      alarm.repeat.forEach((elem, i) => {
        const tempObj = {
          hour: alarm.hour,
          day: order[elem],
          turnOn: true
        }
        if(!turnOnAlarms.includes(JSON.stringify(tempObj))){
          turnOnAlarms.push(JSON.stringify(tempObj))
          this.setState({ turnOnAlarms })
        }
      })
    } else {
      const tempObj = {
        hour: alarm.hour,
        day: getDay(new Date())
      }
      if(!turnOnAlarms.includes(JSON.stringify(tempObj))){
        turnOnAlarms.push(JSON.stringify(tempObj))
        this.setState({ turnOnAlarms })
      }
    }

    if(!alarms.includes(JSON.stringify(alarm))){
      alarms.push(JSON.stringify(alarm))
      this.setState({ alarms })
    }
 }

  toogleAlarm = data => {
    console.log(data)
  }


  render() {
    const { alarms, turnOnAlarms } = this.state
    return (
      <div>
        <MyMenu active="alarm"/>
        <div className="alarm">
          <AlarmForm onSubmit={this.onSubmitForm}/>
          <div className="alarm__alarms">
            {alarms.map(elem => {
              elem = JSON.parse(elem)
              return <Alarm
                        data={elem}
                        key={`${elem.hour}_${elem.repeat.map(day => day).join("_") || "today"}`}
                        toogleAlarm={this.toogleAlarm}/>})}
          </div>
        </div>
      </div>

    );
  }

}

export default Alarms;
