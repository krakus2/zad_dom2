import React, { Component } from 'react';
import MyMenu from './MyMenu'
import AlarmForm from './AlarmForm'
import '../Styles/Alarm.css';


class Alarm extends Component {

  state = {
    alarms: [],
    errors: {},
  }

  //posortowac daty chronologicznie (ale nie za pomoca calych dat, tylko godzin i dni tygodnia)
  //i sprawdzac co sekunde (minute?) czy czas ogolny sie zgadza z czasem budzika
  //jesli tak to wyskakuje popup z zadaniem i drzemka
  //jesli klikne drzemke to dodaje ja do kolejki posrotowanych budzikow

 onSubmitForm = (alarm) => {
   /*
  const alarms = [...this.state.alarms]
  const alarm = {}

  if(alarms.includes(alarm) === false){
    alarms.push(alarm)
    const errors = {}
    errors.duplicate = false
    this.setState({ alarms, errors })
  } else {
    const errors = {}
    errors.duplicate = true
    this.setState({ errors })
  }
  */
  const alarms = [...this.state.alarms]
  //console.log(JSON.stringify(alarms))
  //console.log( JSON.stringify(alarm))
  alarms.push(alarm)
  this.setState({ alarms })
}

  render() {
    return (
      <div>
        <MyMenu active="alarm"/>
        <div className="alarm">
          <AlarmForm onSubmit={this.onSubmitForm}/>
        {/*}  <div className="alarm__alarms">
            {this.state.alarms.map((elem, i) => (
              <span>
                {elem}
                <input type="checkbox" name={`alarm${i}`}></input>
              </span>
            ))}
          </div> {*/}
        </div>
      </div>

    );
  }

}

export default Alarm;
