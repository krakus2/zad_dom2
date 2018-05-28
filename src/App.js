import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Timer2Page from './Components/TimerPageTwo'
import WorldTime from './Components/WorldTime'
import Alarms from './Components/Alarms';


class App extends Component {
  render() {
    return (
        <div className="ui container">
          <Route path="/timer" exact component={Timer2Page} />
          <Route path="/worldtime" exact component={WorldTime} />
          <Route path="/" exact component={Alarms} />
        </div>
    );
  }
}

export default App;
