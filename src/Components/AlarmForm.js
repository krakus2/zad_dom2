import React, { Component } from 'react';
import '../Styles/AlarmForm.css';
import { Button } from 'semantic-ui-react'

class AlarmForm extends Component {

  state = {
    hour: 12,
    minute: 0
  }

  format = (data) => {
    return data < 10 ? `0${data}` : `${data}`
  }

  onChange = e => {
    if( (e.target.name === 'hour' && Number(e.target.value) <= 23) || (e.target.name === 'minute' && Number(e.target.value) <= 59) ){
      this.setState({ [e.target.name]:  Number(e.target.value) })
    }
    console.log(e.target.name, typeof(e.target.value))
  }

  onClick = e => {
    /*this.setState( (prevState, props) => {
      return {
        [e.target.name]: prevState[e.target.name] + 1
      }
    })*/
    console.log("hej")
    if( (e.target.textContent === "+" && e.target.name === "hour" && this.state[e.target.name] < 23) ||
        (e.target.textContent === "+" && e.target.name === "minute" && this.state[e.target.name] < 59) ){
      this.setState({[e.target.name]: this.state[e.target.name] + 1})
    } else if ((e.target.textContent === "-" && e.target.name === "hour" && this.state[e.target.name] > 0) ||
        (e.target.textContent === "-" && e.target.name === "minute" && this.state[e.target.name] > 0)){
      this.setState({[e.target.name]: this.state[e.target.name] - 1})
    }
  }

  onSubmit = e => {
    const alarm = `${this.format(this.state.hour)}:${this.format(this.state.minute)}`
    this.props.onSubmit(alarm)
  }

  render() {
    return (
      <div className="alarm__form">
          <div className="alarm__form__buttonRow">
            <button className="buttonPM" name="hour" onClick={this.onClick} >+</button>
            <button className="buttonPM" name="minute" onClick={this.onClick}>+</button>
          </div>
          <div className="alarm__form__indicatorRow">
            <input type="text" name="hour" className="inputIndicator" value={this.format(this.state.hour)} onChange={this.onChange}></input>
            <input type="text" name="minute" className="inputIndicator" value={this.format(this.state.minute)} onChange={this.onChange}></input>
          </div>
          <div className="alarm__form__buttonRow">
            <button className="buttonPM" name="hour" onClick={this.onClick}>-</button>
            <button className="buttonPM" name="minute" onClick={this.onClick}>-</button>
          </div>
          <button className="buttonSubmit" onClick={this.onSubmit}>Add alarm</button>
      </div>
    );
  }

}

export default AlarmForm;
