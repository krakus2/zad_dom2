import React, { Component } from 'react';
import '../Styles/AlarmForm.css';
import { Button } from 'semantic-ui-react'
import Popup from './Popup'

class AlarmForm extends Component {
  state = {
    minute: '',
    hour: ''
  }

  getDerivedStateFromProps(nextProps, prevState){
    return{
      minute: nextProps.minute,
      hour: nextProps.hour
    }
  }

  onClick = e => {
    const { name, textContent }  = e.target
    if(name === 'minute'){
      if(textContent === "+" && this.state[name] < 59){
        this.props.setMinute(this.state[name] + 1)
      } else if (textContent === "-" && this.state[name] > 0){
        this.props.setMinute(this.state[name] - 1)
      } else if(textContent === "-" && this.state[name] === 0){
        this.props.setMinute(59)
          this.setState({[name]: 59})
      } else if(textContent === "+" && this.state[name] === 59){
          this.props.setMinute(0)
      }
    } else if(name === 'hour'){
      if(textContent === "+" && this.state[name] < 23){
        this.setState({[name]: this.state[name] + 1})
      } else if (textContent === "-" && this.state[name] > 0){
        this.setState({[name]: this.state[name] - 1})
      } else if(textContent === "-" && this.state[name] === 0){
          this.setState({[name]: 23})
      } else if(e.target.textContent === "+" && this.state[name] === 23){
          this.setState({[name]: 0})
      }
    }
  }

  onMouseDown = (e) => {
    const { name, textContent }  = e.target
    console.log(name)
    this.timer = setInterval(() => {
      let data = this.state[name]
      // the function can do whatever you need it to
      if(textContent === '+'){
        if(name === 'hour'){
          if(data < 23 && data >= 0){
            this.setState({ [name]: data + 1})
          } else if (data === 23){
            this.setState({ [name]: 0})
          }
        } else if(name === 'minute' ){
          if(data < 59 && data >= 0){
            this.setState({ [name]: data + 1})
          } else if (data === 59){
            this.setState({ [name]: 0})
          }
        }
      } else if(textContent === '-'){
        if(name === 'hour'){
          if(data <= 23 && data > 0){
            this.setState({ [name]: data - 1})
          } else if (data === 0){
            this.setState({ [name]: 23})
          }
        } else if(name === 'minute' ){
          if(data <= 59 && data > 0){
            this.setState({ [name]: data - 1})
          } else if (data === 0){
            this.setState({ [name]: 59})
          }
        }
      }
    }, 100);
}

  onMouseUp = () => {
    clearInterval(this.timer);
  }

  onMouseLeave = () => {
    clearInterval(this.timer);
  }

  render() {
    return (
      <button className="buttonPM" name={this.props.time} onClick={this.onClick} onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseLeave}>{this.props.sign}</button>
      )
}

export default AlarmForm;
