import React, { Component } from 'react';
import getDay from 'date-fns/get_day'

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
    //console.log(prevState)
      if(nextProps.turnOff !== '' && nextProps.turnOff === prevState.hour && !prevState.repeat.length){
        return {
          turnOn: false
        }
      } else {
        return{
          hour: nextProps.data.hour,
          repeat: nextProps.data.repeat,
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

  render() {
    const {hour, repeat, turnOn } = this.state
    return (
      <div className="alarm">
        {hour}<br />{!!repeat.length && repeat.map(elem => elem).join(" ")}
        <input type="checkbox" checked={turnOn} onChange={this.onToogle}
          name={`${hour} ${!!repeat.length && repeat.map(elem => elem).join("_")}`}/>
      </div>
    );
  }

}

export default Alarm;
