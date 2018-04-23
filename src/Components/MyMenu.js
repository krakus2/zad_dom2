import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

class MyMenu extends Component {
  render() {
    return (
      <div className="MyMenu" >
        <Menu compact widths={2}>
          <Menu.Item active={this.props.active === 'timer'}>
            <Link to='/'>Timer</Link>
          </Menu.Item>
          <Menu.Item active={this.props.active === 'worldtime'}>
            <Link to='/worldtime'>WorldTime</Link>
          </Menu.Item>
       </Menu>
      </div>
    );
  }

}

export default MyMenu;
