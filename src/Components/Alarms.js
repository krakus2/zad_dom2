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
    turnOff: ''
    //checkAlarmCounter: 0
  }

  //posortowac daty chronologicznie (ale nie za pomoca calych dat, tylko godzin i dni tygodnia)
  //i sprawdzac co sekunde (minute?) czy czas ogolny sie zgadza z czasem budzika
  //jesli tak to wyskakuje popup z zadaniem i drzemka
  //jesli klikne drzemke to dodaje ja do kolejki posrotowanych budzikow

 onSubmitForm = (alarm) => {
    const alarms = [...this.state.alarms]
    const shortAlarms = [...this.state.shortAlarms]
    const { order } = this.state
    const date = new Date()

    if(alarm.repeat.length){
      alarm.repeat.forEach((elem, i) => {
        const tempObj = {
          hour: alarm.hour,
          day: order[elem],
          turnOn: true
        }
        if(!shortAlarms.some( elem2 => (elem2.hour === tempObj.hour && elem2.day === tempObj.day))){
          shortAlarms.push(tempObj)
        }
      })

      shortAlarms.sort( (a,b) => {
        if (a.day > b.day) return 1;
        if (a.day < b.day) return -1;
        if (a.hour > b.hour) return 1;
        if (a.hour < b.hour) return -1;
      })

      let counter = 0;
      const shortAlarmsCopy = [...shortAlarms]
      shortAlarmsCopy.forEach( (elem, i) => {
        if( (elem.hour <= `${this.format(date.getHours())}:${this.format(date.getMinutes())}` && elem.day === getDay(new Date())) ||
            ( elem.day < getDay(new Date()))  ){
            console.log((elem.hour < `${this.format(date.getHours())}:${this.format(date.getMinutes())}` && elem.day == getDay(new Date())), ( elem.day < getDay(new Date())))
            console.log(elem.hour, `${this.format(date.getHours())}:${this.format(date.getMinutes())}`, elem.day, getDay(new Date()))
            shortAlarms.splice(i - counter, 1)
            shortAlarms.push(elem)
            counter++
        }
      })
      const turnOnAlarms = shortAlarms.filter(elem3 => elem3.turnOn)

      this.setState({ shortAlarms, turnOnAlarms })
    } else {
      let tempObj = {}
      if(Number(`${alarm.hour.split(":")[0]}${alarm.hour.split(":")[1]}`) <= Number(`${date.getHours()}${date.getMinutes()}`)){
          tempObj.hour = alarm.hour
          tempObj.day =  getDay(new Date()) + 1
          tempObj.turnOn = true
      } else {
        tempObj.hour = alarm.hour
        tempObj.day =  getDay(new Date())
        tempObj.turnOn = true
      }

      if(!shortAlarms.some( elem => (elem.hour === tempObj.hour && elem.day === tempObj.day))){
        shortAlarms.push(tempObj)
        shortAlarms.sort( (a,b) => {
          if (a.day > b.day) return 1;
          if (a.day < b.day) return -1;
          if (a.hour > b.hour) return 1;
          if (a.hour < b.hour) return -1;
        })
        let counter = 0;
        const shortAlarmsCopy = [...shortAlarms]
        shortAlarmsCopy.forEach( (elem, i) => {
          if( (elem.hour <= `${date.getHours()}:${date.getMinutes()}` && elem.day == getDay(new Date())) ||
              ( elem.day < getDay(new Date()))  ){
              console.log((elem.hour <= `${date.getHours()}:${date.getMinutes()}`, elem.day === getDay(new Date())), elem.day < getDay(new Date()))
              shortAlarms.splice(i - counter, 1)
              shortAlarms.push(elem)
              counter++
          }
        })

        const turnOnAlarms = shortAlarms.filter(elem => elem.turnOn)
        this.setState({ shortAlarms, turnOnAlarms })
      }
    }

      if(!alarms.some(elem => isEqual(elem, alarm))){
        alarms.push(alarm)
        this.setState({ alarms, turnOff: '' })
      }
 }

  toogleAlarm = data => {
    const shortAlarms = [...this.state.shortAlarms]
    const date = new Date()

    console.log(data)
    let index;

    if(!Array.isArray(data)){
      if(Number(`${data.hour.split(":")[0]}${data.hour.split(":")[1]}`) <= Number(`${date.getHours()}${date.getMinutes()}`)){
        console.log("no elo 11111111")
        index = shortAlarms.findIndex(elem => elem.hour === data.hour && elem.day  === data.day + 1)
      } else {
        console.log("no elo 2222222222")
        index = shortAlarms.findIndex(elem => elem.hour === data.hour && elem.day === data.day)
      }
      console.log(index)

      let tempObj = {}
      if(Number(`${data.hour.split(":")[0]}${data.hour.split(":")[1]}`) <= Number(`${date.getHours()}${date.getMinutes()}`)){
          tempObj.hour = data.hour
          tempObj.day =  getDay(new Date()) + 1
          tempObj.turnOn = data.turnOn
      } else {
        tempObj.hour = data.hour
        tempObj.day =  getDay(new Date())
        tempObj.turnOn = data.turnOn
      }
      shortAlarms.splice(index, 1, tempObj)
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
    const shortAlarms = [...this.state.shortAlarms]
    const turnOnAlarms = [...this.state.turnOnAlarms]
    const alarms = [...this.state.alarms]
    const { order } = this.state
    //const { checkAlarmCounter } = this.state
    const dateNow = {
      day: getDay(new Date()),
      hour: `${this.format(date.getHours())}:${this.format(date.getMinutes())}`
    }


    if(this.state.minute !== date.getMinutes()){
      this.setState( { minute: date.getMinutes()}, () => {
        if(turnOnAlarms.length > 0){
          if(turnOnAlarms[0].day === dateNow.day && turnOnAlarms[0].hour === dateNow.hour){
            this.setState({ ring: true, showPopup: true, turnOff: dateNow.hour}, () => {
              this.setState({ turnOff: ''})
              }) //po kazdym wylaczeniu trzeba ponownie przeleciec po tych cyklicznych i je wlaczyc, dodatkowo znow posortowac
          }
        }
      })

    }

  }



  format = (data) => {
    return data < 10 ? `0${data}` : `${data}`
  }

  togglePopup = () => {
    const shortAlarms = [...this.state.shortAlarms]
    const alarms = [...this.state.alarms]
    const { order } = this.state
    shortAlarms[0].turnOn = false;
    const date = new Date()

    const repeat = alarms.filter(elem => elem.repeat.length)
    const repeatFormatted = repeat.reduce( (sum, elem, i) => {
      elem.repeat.forEach( elemFor => sum.push({ hour: elem.hour, day: order[elemFor], turnOn: true }) )
      return sum
    }, [])
    const increment = a => a + 1;

    const shortAlarms2 = shortAlarms.map(elem => {
      if(repeatFormatted.some(elem2 => elem2.hour === elem.hour && elem2.day === elem.day)){
        //console.log(elem)
        return {
          ...elem,
          turnOn: true
        }
      } else {
        return {
          ...elem
        }
      }
    })

    console.log(shortAlarms2)
    let counter = 0;
    const shortAlarmsCopy = [...shortAlarms2]
    shortAlarmsCopy.forEach( (elem, i) => {
      console.log(elem)
      if( (elem.hour <= `${date.getHours()}:${date.getMinutes()}` && elem.day == getDay(new Date())) ||
          ( elem.day < getDay(new Date()))  ){
          //console.log((elem.hour > `${date.getHours()}:${date.getMinutes()}` && elem.day === getDay(new Date())), )
          shortAlarms2.splice(i - counter, 1)
          shortAlarms2.push(elem)
          counter++
      }
    })

    const turnOnAlarms = shortAlarms2.filter(elem => elem.turnOn)
     this.setState({
       shortAlarms: shortAlarms2,
       turnOnAlarms,
       showPopup: !this.state.showPopup,
       ring: false
     });
   }

  render() {
    const { alarms, shortAlarms, ring, showPopup, turnOff } = this.state
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
                        toogleAlarm={this.toogleAlarm}
                        turnOff={turnOff}
                      />})}
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
