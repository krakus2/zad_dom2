import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Timer2Page from './Components/TimerPageTwo'
import WorldTime from './Components/WorldTime'


class App extends Component {
  render() {
    return (
        <div className="ui container">
          <Route path="/" exact component={Timer2Page} />
          <Route path="/worldtime" exact component={WorldTime} />
        </div>
    );
  }
}

export default App;
