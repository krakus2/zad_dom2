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
    shortAlarms: [],
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
    playStatus: Sound.status.PLAYING,
    ring: false
  }

  //posortowac daty chronologicznie (ale nie za pomoca calych dat, tylko godzin i dni tygodnia)
  //i sprawdzac co sekunde (minute?) czy czas ogolny sie zgadza z czasem budzika
  //jesli tak to wyskakuje popup z zadaniem i drzemka
  //jesli klikne drzemke to dodaje ja do kolejki posrotowanych budzikow

 onSubmitForm = (alarm) => {
    const alarms = [...this.state.alarms]
    const shortAlarms = [...this.state.shortAlarms]
    const { order } = this.state
    console.log(alarm)

    if(alarm.repeat.length){
      alarm.repeat.forEach((elem, i) => {
        const tempObj = {
          hour: alarm.hour,
          day: order[elem],
          turnOn: true
        }
        if(!shortAlarms.some( elem => (elem.hour === tempObj.hour && elem.day === tempObj.day))){
          shortAlarms.push(tempObj)
          shortAlarms.sort( (a,b) => {
            if (a.day > b.day) return 1;
          	if (a.day < b.day) return -1;
          	if (a.hour > b.hour) return 1;
          	if (a.hour < b.hour) return -1;
          })
          const turnOnAlarms = shortAlarms.filter(elem => elem.turnOn)
          this.setState({ shortAlarms, turnOnAlarms })
        }
      })
    } else {
      const tempObj = {
        hour: alarm.hour,
        day: getDay(new Date()),
        turnOn: true
      }
      if(!shortAlarms.some( elem => (elem.hour === tempObj.hour && elem.day === tempObj.day))){
        shortAlarms.push(tempObj)
        shortAlarms.sort( (a,b) => {
          if (a.day > b.day) return -1;
          if (a.day < b.day) return 1;
          if (a.hour > b.hour) return 1;
          if (a.hour < b.hour) return -1;
        })
        const turnOnAlarms = shortAlarms.filter(elem => elem.turnOn)
        this.setState({ shortAlarms, turnOnAlarms })
      }
    }

    if(!alarms.some(elem => isEqual(elem, alarm))){
      alarms.push(alarm)
      this.setState({ alarms })
    }
 }

  toogleAlarm = data => {
    const shortAlarms = [...this.state.shortAlarms]
    const index = shortAlarms.findIndex(elem => elem.hour === data.hour && elem.day === data.day) //tutaj moze byc kilka indeksow , trzeba to jakos rozwiazac
    shortAlarms.splice(index, 1, data)
    const turnOnAlarms = shortAlarms.filter(elem => elem.turnOn)
    this.setState({ shortAlarms, turnOnAlarms })
  }

  componentDidMount(){
    /*this.interval = setInterval(() => {
      if()
    }, 1000)*/
  }


  render() {
    const { alarms, shortAlarms, ring } = this.state
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
        {ring &&
          <Sound playStatus={this.state.playStatus} url="https://raw.githubusercontent.com/krakus2/zad_dom2/master/src/assets/alarm1.mp3" />
        }
      </div>

    );
  }

}

export default Alarms;
