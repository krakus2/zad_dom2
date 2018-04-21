import React, { Component } from 'react';
import { Form, Button, Input } from 'semantic-ui-react';

class TimerForm extends Component {
  constructor() {
    super();
    this.state = {
      data: {
        from: '',
        to: ''
      }
    }
  }

  onChange = e => this.setState({
    data: { ...this.state.data, [e.target.name]: e.target.value }
  })


  onSubmit = e => {
    e.preventDefault();
    console.log(this.state.data)
    this.props.changeState(this.state.data)
  }

  render() {
    const { data } = this.state;
    return (
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label htmlFor='from'>From</label>
            <Input
              type="text"
              id='from'
              name="from"
              placeholder='100'
              value={data.from}
              onChange={this.onChange}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor='to'>To</label>
            <input
              type="text"
              id='to'
              name="to"
              placeholder='10'
              value={data.to}
              onChange={this.onChange}
            />
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
    );
  }
}

export default TimerForm;
