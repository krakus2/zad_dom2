import React, { Component } from 'react';
import { Button, Card, Image } from 'semantic-ui-react'


class WorldTimeCard extends Component {
  render() {
    return (
      <Card>
       <Card.Content>
         <Card.Header>
           {this.props.data.city}
         </Card.Header>
         <Card.Meta>
           {this.props.data.data}
         </Card.Meta>
         <Card.Description>
           {this.props.data.hours}
         </Card.Description>
       </Card.Content>
     </Card>
    );
  }
}

export default WorldTimeCard;
