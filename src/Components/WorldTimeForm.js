import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import InlineError from './Messages/InlineError'

class WorldTimeForm extends Component {
  constructor() {
    super();
    this.state = {
      city: '',
      cities: [],
      errors: {}
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  onSubmit = e => {
    e.preventDefault();
    let { city, cities } = this.state
    const errors = this.validate(this.state.city)
    console.log("errors from cities", errors)
    if(Object.keys(errors).length === 0){
      cities.push(city)
    }
    city = ''
    this.setState({ city, cities, errors })
    console.log(this.state.cities)
  }

  validate = myString => {
    const errors = {}
    if(/\d/.test(myString) || /\s/.test(myString) || myString.length === 0){
      errors.city = "Pass correct city name, any spaces are forbidden"
    }
    return errors
  }

  render() {
    const { city, errors } = this.state;
    return (
        <div className='TimerForm' style={{marginTop: "20px"}}>
          <Form onSubmit={this.onSubmit}>
            <Form.Field error={!!errors.city}>
              <label htmlFor='city'>City</label>
              <Input
                type="text"
                id='city'
                name="city"
                placeholder='Warsaw'
                value={city}
                onChange={this.onChange}
              />
              {errors.city && <InlineError text={errors.city} /> }
            </Form.Field>
            <Button animated='fade' size='large' color='orange' fluid>
              <Button.Content visible>
               Add City
             </Button.Content>
             <Button.Content hidden disable='true'>
               Check local time in chosen location
             </Button.Content>
            </Button>
          </Form>
        </div>
    );
  }
}

export default WorldTimeForm;
