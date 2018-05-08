import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import InlineError from './Messages/InlineError'
import '../Styles/WorldTimeForm.css'

class WorldTimeForm extends Component {
    state = {
      city: '',
      cities: [],
      errors: {}
    }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = e => {
    e.preventDefault();
    //this.props.changeErrors();
    let { city, cities } = this.state
    const errors = this.validate(city, cities)
    if(Object.keys(errors).length === 0){
      cities.push(city)
      this.props.changeCities(cities)
    }
    city = ''
    this.setState({ city, cities, errors })
  }

  validate = (myString, myStrings) => {
    const errors = {}
    if(/\d/.test(myString)){
      errors.city = "Pass correct city name"
    } else if (myString.length === 0){
        errors.city = "Don't pass empty string"
    } else if(myStrings.indexOf(myString) !== -1) {
        errors.city = "Don't duplicate cities"
    }
    return errors
  }

  render() {
    const { city, errors } = this.state;
    return (
        <div className='WordTimeForm' style={{marginTop: "20px"}}>
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
