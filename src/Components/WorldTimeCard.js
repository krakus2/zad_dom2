import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'
import PageVisibility from 'react-page-visibility';


class WorldTimeCard extends Component {
  state = {
    data: '',
    hours: '',
    now: 0,
    counter: 0
  }


  componentDidMount(){
    this.change()
  }

  format = (enter) => {
    let result
    if(enter >= 10){
      result = `${enter}`
    } else {
      result = `0${enter}`
    }
    return result;
  }


  change = () => {
    this.setState({ now: Date.now()})
    window.requestAnimationFrame(this.tick)
  }

  tick = () => {
    //console.log("tick1", Date.now(), this.state.now, Date.now() - this.state.now)
    if(Date.now() - this.state.now >= 1000){
      const { hours } = this.state
      let hour = Number(hours.slice(0,2))
      let minute = Number(hours.slice(3,5))
      let second = Number(hours.slice(6,8))
      if(hour === 23 && minute === 59 && second === 59){
        hour = 0
        minute = 0
        second = 0;
      } else {
        if(minute === 59 && second === 59){
          minute = 0;
          second = 0;
          hour++;
        }else{
          if(second === 59){
            second = 0;
            minute++;
          }else {
            second++;
          }
        }
      }

      this.setState({
        now: Date.now(),
        hours: `${this.format(hour)}:${this.format(minute)}:${this.format(second)}`},
        () => window.requestAnimationFrame(this.tick))
        this.props.updateHours(`${this.format(hour)}:${this.format(minute)}:${this.format(second)}`, this.props.key2)
    } else {
        window.requestAnimationFrame(this.tick)
    }
  }

  updateAfterBrake = data => {
    let sec1, min1, hour1;
    hour1 = Math.floor(data/3600)
    data = data % 3600
    min1 = Math.floor(data/60)
    data = data % 60
    sec1 = data

    //console.log(sec1, min1, hour1)
    const { hours } = this.state
    let hour = Number(hours.slice(0,2))
    let minute = Number(hours.slice(3,5))
    let second = Number(hours.slice(6,8))

    hour += hour1
    minute += min1
    second += sec1
    if(second >= 60){
      minute++
      second -= 60
    }
    if(minute >= 60){
      hour++
      minute -= 60
    }
    if(hour >= 24){
      hour -= 24
    }

    this.setState({
      hours: `${this.format(hour)}:${this.format(minute)}:${this.format(second)}`})
  }

  handleVisibilityChange = (isVisible) => {
    let secs;
    if(!isVisible){
      this.interval = setInterval(() => {
        let { counter } = this.state
        this.setState({ counter: counter + 1})
      }, 1000)
    } else {
      clearInterval(this.interval)
      secs = this.state.counter
      this.setState({ counter: 0})
      this.updateAfterBrake(secs)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    return{
      data: nextProps.data.data,
      hours: nextProps.data.hours
    }
  }
  render() {
    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <Card>
         <Card.Content>
           <Card.Header>
             {this.props.data.city}
           </Card.Header>
           <Card.Meta>
             {this.state.data}
           </Card.Meta>
           <Card.Description>
             {this.state.hours}
           </Card.Description>
         </Card.Content>
       </Card>
     </PageVisibility>
    );
  }
}

export default WorldTimeCard;
