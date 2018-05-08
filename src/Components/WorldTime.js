import React, { Component } from 'react';
import MyMenu from './MyMenu'
import WorldTimeForm from './WorldTimeForm'
import WorldTimeCard from './WorldTimeCard'
import axios from 'axios'
import { Dimmer, Loader, Segment, Card } from 'semantic-ui-react'
import '../Styles/WorldTime.css'
import InlineError from './Messages/InlineError'

class WorldTime extends Component {
  state = {
    data: {
      cities: []
    },
    errors: {},
    timeData: [],
    condition: false, //if the timeData is provided
  }

  changeCities = (data) => {
    //console.log(data)
    this.setState({
      data: { cities: data },
      errors: {}},
      () => this.setAsk())
  }

  setAsk = () => {
    const city = this.state.data.cities[this.state.data.cities.length-1]

    if(Object.keys(this.state.errors).length === 0){
      this.queryAxiosGoogle(city)
      this.setState({ lastCity: city})
    }
  }

  queryAxiosGoogle = (data) => {
    const { cities } = {...this.state.data}
    console.log(data)
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${data}&key=${process.env.REACT_APP_MAP_API}`)
      .then(response => {
        const latlong = { cords: response.data.results[0].geometry.location,
          city: response.data.results[0].formatted_address}
        return latlong
      })
      .catch(error => {
        const errors = {...this.state.errors}
        if(error.response){
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          errors.response = [error.response.data, error.response.status, error.response.headers]
          cities.pop()
          this.setState({ errors, data: { cities } })
        }else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          errors.response = [error.request]
          cities.pop()
          this.setState({ errors, data: { cities } })
        } else {
          //console.log('Error', error.message, data);
          errors.response = [`There is no such city as ${data}`, error.message]
          cities.pop()
          console.log(errors, cities)
          this.setState({ errors, data: { cities } })
        }
        return errors
      })
      .then(data => {
        if(Object.keys(data)[0] !== 'response'){
          this.queryAxiosTime(data)
        }
      })
  }

  queryAxiosTime = (cityData) => {
    axios.get(`https://thingproxy.freeboard.io/fetch/http://api.timezonedb.com/v2/get-time-zone?key=${process.env.REACT_APP_TIME_API}&format=json&by=position&lat=${cityData.cords.lat}&lng=${cityData.cords.lng}`)
      .then(response => {
        const { formatted } = response.data
        const data = formatted.substr(formatted.indexOf("2018"), 10)
        const hours = formatted.substr(formatted.length-8, 10)
        return {city: cityData.city, data, hours}
      })
      .then(nextData => {
        console.log(nextData)
        const timeData = [...this.state.timeData]
        timeData.push(nextData)
        this.setState({
          timeData,
          condition: true,
        })
      })
  }

  componentDidUpdate(prevState, prevProps){
    console.log(prevState, prevProps)
  }


  updateHours = (hour, key) => {
    function condition(elem){
      return elem.city === key
    }
    const timeData = [...this.state.timeData]
    //console.log(data, array, key)
    const index = timeData.findIndex(condition)
    console.log(index)
    timeData[index].hours = hour
    this.setState({ timeData })

  }


  render() {
    const { timeData, condition, errors } = this.state
    const { cities } = this.state.data
    //loading oparty o roznice w dlugosci tablic timedata i cities
    return (
      <div className='WorldTime'>
        <MyMenu active="worldtime"/>
        <WorldTimeForm changeCities={this.changeCities} />
        {Object.keys(errors).length !== 0 && <InlineError text={errors.response[0]} /> }
          <div className="results">
            <Card.Group itemsPerRow={5}>
            {condition && timeData.map((elem, i) => (
              <WorldTimeCard key={elem.city} key2={elem.city} data={elem} updateHours={this.updateHours}/>))}
            {(cities.length !== timeData.length) && Object.keys(errors).length === 0 &&
              <Segment size="huge" className="segment_loading">
                <Dimmer active>
                  <Loader>Loading</Loader>
                </Dimmer>
              </Segment>}
            </Card.Group>
          </div>
      </div>
    );
  }
}

export default WorldTime;
