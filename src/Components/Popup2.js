import React, { Component } from 'react';
import '../Styles/Popup2.css';
import InlineError from './Messages/InlineError'

class Popup2 extends React.Component {
  state = {
    x: '',
    y: '',
    result: '',
    message: false
  }

  componentDidMount(){
    this.setState({x: Math.floor((Math.random() * 100) + 1), y: Math.floor((Math.random() * 100) + 1)})
  }

  closeMathPopup = () => {
    const { x, y, result } = this.state
    if((x + y) === Number(result) || !this.props.mathTask ){
      console.log("wtf")
      this.props.closePopup()
    }
    else {
      this.setState({message: true})
      console.log((x + y) === Number(result))
      console.log(x, y, result, Number(result), (x+y))
      console.log(!this.props.mathTask)
    }
  }

  onChange = e => {
    console.log(e.target.value)
    this.setState({[e.target.name] : e.target.value})
  }

  render() {
    const { x, y, message } = this.state
    return (
      <div className='popup2'>
        <div className='popup2__inner'>
        <div className="popup2__title">Alarm</div>
          {
            this.props.mathTask &&
            <div className="popup2__task">
              {`${x} + ${y} = `}
              <input type="text" onChange={this.onChange} name="result" className="task__result"></input>
            </div>
          }
        {!!message && <InlineError text={"You are wrong!"} />}
        <button className="popup2__closeButton" onClick={this.closeMathPopup}>close me</button>
        </div>
      </div>
    );
  }
}

export default Popup2;
