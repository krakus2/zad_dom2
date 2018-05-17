import React, { Component } from 'react';
import MyMenu from './MyMenu'
import AlarmForm from './AlarmForm'
import '../Styles/Alarms.css';
import getDay from 'date-fns/get_day'
import Alarm from './Alarm'
import isEqual from 'lodash.isequal';
import Sound from 'react-sound';
import Popup2 from './Popup2'

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
    ring: false,
    showPopup: false,
    minute: '',
    checkAlarmCounter: 0
  }

  //posortowac daty chronologicznie (ale nie za pomoca calych dat, tylko godzin i dni tygodnia)
  //i sprawdzac co sekunde (minute?) czy czas ogolny sie zgadza z czasem budzika
  //jesli tak to wyskakuje popup z zadaniem i drzemka
  //jesli klikne drzemke to dodaje ja do kolejki posrotowanych budzikow

 onSubmitForm = (alarm) => {
    const alarms = [...this.state.alarms]
    const shortAlarms = [...this.state.shortAlarms]
    const { order } = this.state

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
          this.setState({ shortAlarms, turnOnAlarms, checkAlarmCounter: 0 })
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
        this.setState({ shortAlarms, turnOnAlarms, checkAlarmCounter: 0 })
      }
    }

    if(!alarms.some(elem => isEqual(elem, alarm))){
      alarm.turnOn =
      alarms.push(alarm)
      this.setState({ alarms })
    }
 }

  toogleAlarm = data => {
    const shortAlarms = [...this.state.shortAlarms]
    if(!Array.isArray(data)){
      const index = shortAlarms.findIndex(elem => elem.hour === data.hour && elem.day === data.day)
      shortAlarms.splice(index, 1, data)
    } else {
        const indexes = shortAlarms.reduce( (indexes, elem, i) => {
          data.forEach(data2 => {
            if(elem.hour === data2.hour && elem.day === data2.day){
              indexes.push(i)
            }
          })
          return indexes
        }, [])
          .forEach((elem, i) => {
            shortAlarms.splice(elem, 1, data[i])
          })
      }

    const turnOnAlarms = shortAlarms.filter(elem => elem.turnOn)
    this.setState({ shortAlarms, turnOnAlarms })
  }

  componentDidMount(){
    const date = new Date();
    this.setState({ minute: date.getMinutes()})
    this.interval = setInterval(() => {
      this.checkAlarm()
    }, 1000)
  }

  checkAlarm = () => {
    const date = new Date()
    const turnOnAlarms = [...this.state.turnOnAlarms]
    const { checkAlarmCounter } = this.state
    const dateNow = {
      day: getDay(new Date()),
      hour: `${date.getHours()}:${date.getMinutes()}`
    }

    if(checkAlarmCounter === 0){
      if(turnOnAlarms.length > 0){
        if(turnOnAlarms[0].day === dateNow.day && turnOnAlarms[0].hour === dateNow.hour){
          this.setState({ ring: true, showPopup: true})
        }
      this.setState({ checkAlarmCounter: checkAlarmCounter+1})
      }
    }

    if(this.state.minute !== date.getMinutes()){
      this.setState({ minute: date.getMinutes()}, () => {
        if(turnOnAlarms.length > 0){
          if(turnOnAlarms[0].day === dateNow.day && turnOnAlarms[0].hour === dateNow.hour){
            this.setState({ ring: true, showPopup: true})
          }
        }
      })
    }
  }

  togglePopup = () => {
    const shortAlarms = [...this.state.shortAlarms]
    shortAlarms[0].turnOn = false;
    const turnOnAlarms = shortAlarms.filter(elem => elem.turnOn)

     this.setState({
       shortAlarms,
       turnOnAlarms,
       showPopup: !this.state.showPopup,
       ring: false
     });
   }


  render() {
    const { alarms, shortAlarms, ring, showPopup } = this.state
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
          <Sound playStatus={this.state.playStatus} url="https://raw.githubusercontent.com/krakus2/zad_dom2/master/src/assets/alarm1.mp3" loop={true}/>
        }
        {showPopup && <Popup2 closePopup={this.togglePopup}/>}
      </div>

    );
  }

}

export default Alarms;
