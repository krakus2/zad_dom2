import React, { Component } from 'react';
import Counter from './Components/Counter'
import './Styles/App.css'


class App extends Component {

  onSuccess = () => {
    console.log("Sukces")
  }

  render() {
    return (
      <div className="App">

        <Counter from={13} to={10} onSuccess={this.onSuccess}/>
      </div>
    );
  }
}

export default App;
