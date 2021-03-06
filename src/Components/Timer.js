import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Styles/Counter.css'
import { Statistic } from 'semantic-ui-react'


class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: 0,//this.props.from - tak sie nie robi
      to: 0,//this.props.to,
      clock: 0,
      isRunning: false,
      counter: 0
    }
  }

    timer = () => {
      let {from, to, isRunning, counter} = this.state
      counter = counter + 0.01;
      from = from - 0.01;
      let clock = from - to;
      clock = clock.toFixed(2)
      //console.log(clock)
      if(clock == 0){
        this.props.onSuccess();
        isRunning = false;
        console.log("jestem zerem", clock)
        clearInterval(this.interval)
      }
      this.setState({ from, clock, isRunning, counter })
    }

    timerLook = (time) => {
      let min, sec, milSec;
      min = Math.floor(time / 60)
      time = time - min*60;
      sec = (time % 60) < 10 ? `0${(time % 60)}` : `${(time % 60)}`;
      const temp = String(Number(sec).toFixed(2))
      sec = String(sec).substr(0,2)
      milSec = temp.slice(temp.length-2,temp.length)
      return `${min}:${sec}:${milSec}`
    }

    /*timerLook(time){
      return `${Math.floor(time / 60)}:${Math.floor(time % 60 > 9 ?)}
    }*/

    componentDidUpdate() {
      let { counter, from, to } = this.state;
      if(from){
        var x = from - to;
        if(x === counter){
          //console.log("ze srodka ", counter)
          clearInterval(this.interval)
          this.interval = setInterval(
            () => this.timer(),
            10);
        }
      }
      //console.log("componentDidUpdate!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", x, counter)
    }

    componentWillUnmount() {
      clearInterval(this.interval)
      let isRunning = this.state.isRunning
      isRunning = false;
      this.setState({ isRunning })
    }

    static getDerivedStateFromProps(nextProps, prevState){
      //console.log("getDerivedStateFromProps: ", nextProps, prevState)
      return {
        from: nextProps.from,
        to: nextProps.to,
        isRunning: true,
        counter: nextProps.from - nextProps.to
      }
    }

    onClick = () => {
      let { isRunning, clock }  = this.state
      if(clock){
        if(isRunning){
          clearInterval(this.interval)
          isRunning = false;
          this.setState({ isRunning })
        } else if(!isRunning && clock != 0){
          this.interval = setInterval(
            () => this.timer(),
            10);
          isRunning = true;
          this.setState({ isRunning })
        }
      }
    }

  render() {
    return (
      <div className="counter" onClick={this.onClick}>
        <Statistic.Group style={{marginLeft: "auto", marginRight: "auto", marginTop: "50px"}}>
          <Statistic size='huge'>
            <Statistic.Value>
              {this.timerLook(this.state.clock)}
                {/*(this.state.clock === 0 ? toString(this.state.clock) : this.state.clock ) &&{*/}
            </Statistic.Value>
            <Statistic.Label>Timer</Statistic.Label>
          </Statistic>
       </Statistic.Group>
      </div>
    );
  }
}

Timer.propTypes = {
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  onSuccess: PropTypes.func
}

export default Timer;
