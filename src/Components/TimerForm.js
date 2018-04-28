import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import InlineError from './Messages/InlineError'

class TimerForm extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        from: '',
        to: 0
      },
      errors: {},
      loading: false
    }
  }

  onChange = e => this.setState({
    data: { ...this.state.data, [e.target.name]: e.target.value }
  })


  onSubmit = e => {
    e.preventDefault();
    const errors = this.validate(this.state.data)
    //console.log(errors)
    this.setState({ errors });
    if(Object.keys(errors).length === 0){
      this.props.changeState(this.state.data)
    }
  }

  validate = (data) => {
    const errors = {},
      data1 = data.from.toString(), // force the value incase it is not
      data2 = data.to.toString()
    const x1 = Math.abs(data1),
      x2 = parseInt(data1, 10),
      y1 = Math.abs(data2),
      y2 = parseInt(data2, 10);
    if(!(!isNaN(x1) && x2 === x1 && x1.toString() === data1)){
      errors.from = 'Enter valid natural number in "from" gap'
    }
    if(!(!isNaN(y1) && y2 === y1 && y1.toString() === data2)){
      errors.to = 'Enter valid natural number in "to" gap'
    }
    return errors
  }

  render() {
    const { data, errors } = this.state;
    return (
        <div className='TimerForm' style={{marginTop: "20px"}}>
          <Form onSubmit={this.onSubmit}>
            <Form.Field error={!!errors.from}>
              <label htmlFor='from'>From</label>
              <Input
                type="text"
                id='from'
                name="from"
                placeholder='100'
                value={data.from}
                onChange={this.onChange}
              />
              {errors.from && <InlineError text={errors.from} /> }
            </Form.Field>
            <Form.Field error={!!errors.to}>
              <label htmlFor='to'>To</label>
              <input
                type="text"
                id='to'
                name="to"
                placeholder='10'
                value={data.to}
                onChange={this.onChange}
              />
              {errors.to && <InlineError text={errors.to} /> }
            </Form.Field>
            <Button animated='fade' size='large' color='orange' fluid>
              <Button.Content visible>
               Start Timer
             </Button.Content>
             <Button.Content hidden disable='true'>
               Click on timer to stop
             </Button.Content>
            </Button>
          </Form>
        </div>
    );
  }
}

export default TimerForm;
