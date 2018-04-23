import React, { Component } from 'react';
import MyMenu from './MyMenu'
import WorldTimeForm from './WorldTimeForm'
import axios from 'axios'

class WorldTime extends Component {
  state = {
    data: {
      cities: []
    },
    errors: {},
    timeData: {}
  }

  changeCities = (data) => {
    //console.log(data)
    this.setState({
      data: { cities: data },
    })
  }

  changeErrors = () => {
    this.setState({
      errors: {}
    })
    //console.log("change errors")
  }

  queryAxiosGoogle = (data) => {
    console.log(process.env.REACT_APP_MAP_API)
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${data}&key=${process.env.REACT_APP_MAP_API}`)
      .then(response => {
        //console.log(response.data.results[0])
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
          this.setState({ errors })
        }else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
          errors.response = [error.request]
          this.setState({ errors })
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message, data);
          errors.error = [`There is no such city as ${data}`, error.message]
          this.setState({ errors })
        }
        return errors
      })
      .then(data => {
        if(Object.keys(data)[0] !== 'error'){
          this.queryAxiosTime(data)
        }
        //console.log(Object.keys(data)[0], "ostatni krok 1axios")
      })
  }

  queryAxiosTime(data){
    //console.log("hejka z nowego query axios", data, process.env.REACT_APP_TIME_API)
    axios.get(`http://api.timezonedb.com/v2/get-time-zone?key=${process.env.REACT_APP_TIME_API}&format=json&by=position&lat=${data.cords.lat}&lng=${data.cords.lng}`)
      .then(response => {
        console.log(data.city, response.data.formatted)
      })
  }

  /*shouldComponentUpdate(nextProps, nextState){
    //console.log(Object.keys(nextState.errors).length)
    return Object.keys(nextState.errors).length === 0
  }*/

  componentDidUpdate(prevProps, prevState){
    if(Object.keys(this.state.errors).length === 0){
      const city = this.state.data.cities[this.state.data.cities.length-1]
      //console.log(city)
      this.queryAxiosGoogle(city)
    }
  }

  render() {
    return (
      <div className='WorldTime'>
        <MyMenu active="worldtime"/>
        <WorldTimeForm changeCities={this.changeCities} error={this.state.errors}
          changeErrors={this.changeErrors}/>
      </div>
    );
  }
}

export default WorldTime;
