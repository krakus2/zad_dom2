import React, { Component } from 'react';
import { Card } from 'semantic-ui-react'


class WorldTimeCard extends Component {
  state = {
    data: '',
    hours: '',
    now: 0
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
      if(minute === 59){
        minute = 0;
        hour++;
      }else{
        if(second === 59){
          second = 0;
          minute++;
        }else {
          second++;
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

  static getDerivedStateFromProps(nextProps, prevState){
    return{
      data: nextProps.data.data,
      hours: nextProps.data.hours
    }
  }
  render() {
    return (
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
    );
  }
}

export default WorldTimeCard;
