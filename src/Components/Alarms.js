import React, { Component } from 'react';
import MyMenu from './MyMenu'
import AlarmForm from './AlarmForm'
import '../Styles/Alarms.css';
import getDay from 'date-fns/get_day'
import Alarm from './Alarm'
import isEqual from 'lodash.isequal';
import Sound from 'react-sound';
import Popup2 from './Popup2';
import InlineError from './Messages/InlineError'
import { CSSTransitionGroup } from 'react-transition-group'
import { base } from '../base'

class Alarms extends Component {
  state = {
    alarms: [],
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
    order2: {
      1: "poniedzialek",
      2: "wtorek",
      3: "sroda",
      4: "czwartek",
      5: "piatek",
      6: "sobota",
      7: "niedziela",
    },
    playStatus: Sound.status.PLAYING,
    ring: false,
    showPopup: false,
    minute: '',
    turnOff: '',
    showMathTask: false
    //checkAlarmCounter: 0
  }

  //posortowac daty chronologicznie (ale nie za pomoca calych dat, tylko godzin i dni tygodnia)
  //i sprawdzac co sekunde (minute?) czy czas ogolny sie zgadza z czasem budzika
  //jesli tak to wyskakuje popup z zadaniem i drzemka
  //jesli klikne drzemke to dodaje ja do kolejki posrotowanych budzikow

 onSubmitForm = (alarm) => {
    const alarms = [...this.state.alarms]
    const shortAlarms = [...this.state.shortAlarms]
    const { order, order2 } = this.state
    const date = new Date()
    console.log(alarm)

    if(alarm.repeat.length){
      alarm.repeat.forEach((elem, i) => {
        const tempObj = {
          hour: alarm.hour,
          day: order[elem],
          //taskToTurnOff: alarm.taskToTurnOff,
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
            shortAlarms.splice(i - counter, 1)
            shortAlarms.push(elem)
            counter++
        }
      })
      const turnOnAlarms = shortAlarms.filter(elem3 => elem3.turnOn)

      this.setState({ shortAlarms, turnOnAlarms, error: '' })
    } else {
      let tempObj = {}
      if(Number(`${alarm.hour.split(":")[0]}${alarm.hour.split(":")[1]}`) <= Number(`${date.getHours()}${date.getMinutes()}`)){
          tempObj.hour = alarm.hour
          tempObj.day =  getDay(new Date()) + 1
          //tempObj.taskToTurnOff =  alarm.taskToTurnOff
          tempObj.turnOn = true
      } else {
        tempObj.hour = alarm.hour
        tempObj.day =  getDay(new Date())
        //tempObj.taskToTurnOff =  alarm.taskToTurnOff
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
              //console.log((elem.hour <= `${date.getHours()}:${date.getMinutes()}`, elem.day === getDay(new Date())), elem.day < getDay(new Date()))
              shortAlarms.splice(i - counter, 1)
              shortAlarms.push(elem)
              counter++
          }
        })

        const turnOnAlarms = shortAlarms.filter(elem => elem.turnOn)
        this.setState({ shortAlarms, turnOnAlarms, error: '' })
      }
    }
      if(alarm.repeat.length){
        if(!alarms.some(elem => elem.hour === alarm.hour
          && alarm.repeat.some(day => (elem.repeat.join(" ").indexOf(day) > -1))
        )){
          alarms.push(alarm)
          this.setState({ alarms, turnOff: '' })
        } else {
          this.setState({ error: "Don't add two alarms, at the same time" })
        }
      } else {
        if ( !alarms.some(elem =>  !elem.repeat.length ? elem.hour === alarm.hour :
            ( elem.repeat.join(" ") === order2[getDay(new Date())] && elem.hour === alarm.hour) ) ){
          alarms.push(alarm)
          this.setState({ alarms, turnOff: '' })
        } else {
          this.setState({ error: "Don't add two alarms, at the same time" })
        }
      }

 }

  toogleAlarm = data => {
    const shortAlarms = [...this.state.shortAlarms]
    const date = new Date()

    let index;

    if(!Array.isArray(data)){
      if(Number(`${data.hour.split(":")[0]}${data.hour.split(":")[1]}`) <= Number(`${date.getHours()}${date.getMinutes()}`)){
        index = shortAlarms.findIndex(elem => elem.hour === data.hour && elem.day  === data.day + 1)
      } else {
        index = shortAlarms.findIndex(elem => elem.hour === data.hour && elem.day === data.day)
      }

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
    const { order, order2} = this.state
    const dateNow = {
      day: getDay(new Date()),
      hour: `${this.format(date.getHours())}:${this.format(date.getMinutes())}`
    }

    let variable = false

    if(this.state.minute !== date.getMinutes()){
      if(turnOnAlarms.length){
         variable = alarms.some(elem => elem.hour === turnOnAlarms[0].hour &&
          elem.repeat.length ? elem.repeat.join(" ").includes(order2[turnOnAlarms[0].day]) : getDay(new Date()) ===  turnOnAlarms[0].day &&
          elem.taskToTurnOff === true)
      }
      this.setState( { minute: date.getMinutes(), showMathTask: variable}, () => {
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
    //const increment = a => a + 1;

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

    let counter = 0;
    const shortAlarmsCopy = [...shortAlarms2]
    shortAlarmsCopy.forEach( (elem, i) => {
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

 deleteAlarm = data => {
   const { alarms, shortAlarms, order } = this.state
   let table = []
   console.log(data)

   if(data.repeat !== "false"){
     table = data.repeat.split(" ").map(elem => {
       return {
         hour: data.hour,
         day: order[elem]
       }
     })
   } else {
     const date = new Date();
     const hourNow = `${date.getHours()}${date.getMinutes()}`
     if(Number(data.hour.replace(":", "")) <= Number(hourNow)){
       table.push({
         hour: data.hour,
         day: getDay(new Date()) + 1
       })
     } else {
       table.push({
         hour: data.hour,
         day: getDay(new Date())
       })
     }
   }

   console.log(table)
   const filteredAlarms = alarms.filter(elem => {
     return !(elem.hour === data.hour && (elem.repeat.length ? elem.repeat.join(" ") === data.repeat : data.repeat === "false"))
   })

   const filteredShortAlarms = shortAlarms.filter(elem => {
     return !table.some( tableElem => tableElem.hour === elem.hour && tableElem.day === elem.day)
   })

   const turnOnAlarms = filteredShortAlarms.filter(elem => elem.turnOn)
   //console.log(filteredAlarms, filteredShortAlarms)
   this.setState({ alarms: filteredAlarms, shortAlarms: filteredShortAlarms, turnOnAlarms})
 }

 /*componentWillMount() {
     this.alarmsRef = base.syncState('alarms', {
       context: this,
       state: 'alarms',
       asArray: true
     });
   }

   componentWillUnmount() {
     base.removeBinding(this.songsRef);
   }*/



  render() {
    const { alarms, shortAlarms, ring, showPopup, turnOff, error, showMathTask } = this.state
    const style = {
      width: "205px",
      marginBottom: "10px",
      textAlign: "center"
    }
    return (
      <div>
        <MyMenu active="alarm"/>
        <div className="alarmSite">
          <div className="alarmSite__left">
            <AlarmForm onSubmit={this.onSubmitForm}/>
            {!!error && <InlineError text={error} style={style}/>}
          </div>
          {/*}<div className="alarm__alarms">{*/}
          <CSSTransitionGroup
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            className='alarmSite__alarms'
            component='div'
            transitionName='alarmSite__alarms'
          >
            {alarms.map(elem =>
              <Alarm
                data={elem}
                key={`${elem.hour}_${elem.repeat.map(day => day).join("_") || "today"}`}
                toogleAlarm={this.toogleAlarm}
                turnOff={turnOff}
                delete={this.deleteAlarm}
              />
                    )}
          </CSSTransitionGroup>
          {/*}</div>{*/}
        </div>
        {ring &&
          <Sound playStatus={this.state.playStatus} url="https://raw.githubusercontent.com/krakus2/zad_dom2/master/src/assets/alarm1.mp3" loop={true}/>
        }
        {showPopup && <Popup2 closePopup={this.togglePopup} mathTask={showMathTask}/>}
      </div>
    );
  }
}

export default Alarms;
