import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../Styles/Counter.css'

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: this.props.from,
      to: this.props.to,
      clock: undefined,
      isRunning: false
    }
    this.onClick = this.onClick.bind(this)
  }

    timer() {
      let [from, to, isRunning] = [this.state.from, this.state.to, this.state.isRunning]
      let clock = from - to;
      from--;
      if(clock === 0){
        this.props.onSuccess();
        isRunning = false;
        clearInterval(this.interval)
      }
      this.setState({ from, clock, isRunning })
    }

    /*clockLook(number){
      let minutes = Math.floor(number / 60);
      let seconds = number - minutes * 60;
      if(number%60 > 1){
        min = number%60
      }
      console.log(`min: ${min}, clock: ${number}`)
    }*/

    fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

    componentDidMount() {
      let isRunning = this.state.isRunning
      isRunning = true;
      this.setState({ isRunning })
      if(isRunning){
        this.interval = setInterval(
          () => this.timer(),
          1000);
      }
    }


    componentWillUnmount() {
      clearInterval(this.interval)
      let isRunning = this.state.isRunning
      isRunning = false;
      this.setState({ isRunning })
    }

    onClick(){
      let isRunning = this.state.isRunning

      if(isRunning){
        clearInterval(this.interval)
        isRunning = false;
        this.setState({ isRunning })
      } else {
        this.interval = setInterval(
          () => this.timer(),
          1000);
        isRunning = true;
        this.setState({ isRunning })
      }
    }

  render() {
    return (
      <div className="counter" onClick={this.onClick}>
        <span>Time to apocalypse</span>
        {(this.state.clock === 0 ? toString(this.state.clock) : this.state.clock ) &&
          this.fmtMSS(this.state.clock)}
      </div>
    );
  }
}

Counter.propTypes = {
  from: PropTypes.number.isRequired,
  to: PropTypes.number.isRequired,
  onSuccess: PropTypes.func
}

export default Counter;
