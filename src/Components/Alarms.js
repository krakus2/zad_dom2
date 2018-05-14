import React, { Component } from 'react';
import MyMenu from './MyMenu'
import AlarmForm from './AlarmForm'
import '../Styles/Alarms.css';
import getDay from 'date-fns/get_day'
import Alarm from './Alarm'
import isEqual from 'lodash.isequal';
import Sound from 'react-sound';

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
    },
    playStatus: Sound.status.PLAYING
  }

  //posortowac daty chronologicznie (ale nie za pomoca calych dat, tylko godzin i dni tygodnia)
  //i sprawdzac co sekunde (minute?) czy czas ogolny sie zgadza z czasem budzika
  //jesli tak to wyskakuje popup z zadaniem i drzemka
  //jesli klikne drzemke to dodaje ja do kolejki posrotowanych budzikow

 onSubmitForm = (alarm) => {
    const alarms = [...this.state.alarms]
    const turnOnAlarms = [...this.state.turnOnAlarms]
    const { order } = this.state

    if(alarm.repeat.length){
      alarm.repeat.forEach((elem, i) => {
        const tempObj = {
          hour: alarm.hour,
          day: order[elem],
          turnOn: true
        }
        if(!turnOnAlarms.some( elem => isEqual(elem, tempObj))){
          turnOnAlarms.push(tempObj)
          turnOnAlarms.sort( (a,b) => {
            if (a.day > b.day) return 1;
          	if (a.day < b.day) return -1;
          	if (a.hour > b.hour) return 1;
          	if (a.hour < b.hour) return -1;
          })
          this.setState({ turnOnAlarms })
        }
      })
    } else {
      const tempObj = {
        hour: alarm.hour,
        day: getDay(new Date()),
        turnOn: true
      }
      if(!turnOnAlarms.some( elem => isEqual(elem, tempObj))){
        turnOnAlarms.push(tempObj)
        turnOnAlarms.sort( (a,b) => {
          if (a.day > b.day) return -1;
          if (a.day < b.day) return 1;
          if (a.hour > b.hour) return 1;
          if (a.hour < b.hour) return -1;
        })
        this.setState({ turnOnAlarms })
      }
    }

    if(!alarms.some(elem => isEqual(elem, alarm))){
      alarms.push(alarm)
      this.setState({ alarms })
    }
 }

  toogleAlarm = data => {
    const turnOnAlarms = [...this.state.turnOnAlarms]
    const index = turnOnAlarms.findIndex(elem => elem.hour === data.hour && elem.day === data.day)
    turnOnAlarms.splice(index, 1, data)
    this.setState({ turnOnAlarms })
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
              return <Alarm
                        data={elem}
                        key={`${elem.hour}_${elem.repeat.map(day => day).join("_") || "today"}`}
                        toogleAlarm={this.toogleAlarm}/>})}
          </div>
        </div>
        <Sound playStatus={this.state.playStatus} url="https://raw.githubusercontent.com/scottschiller/SoundManager2/master/demo/_mp3/1hz-10khz-sweep.mp3" />
      </div>

    );
  }

}

export default Alarms;
