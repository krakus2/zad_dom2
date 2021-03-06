import React, { Component } from 'react';
import '../Styles/Popup.css';

class Popup extends React.Component {
  state = {
    days: ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela'],
    daysActive: []
  }

  onToogle = (e) => {
    const daysActive = [...this.state.daysActive]
    if(e.target.checked){
      daysActive.push(e.target.name)
    }else{
      daysActive.splice(daysActive.indexOf(e.target.name), 1);
    }

    const order = {
      // "sunday": 0, // << if sunday is first day of week
      "poniedzialek": 1,
      "wtorek": 2,
      "sroda": 3,
      "czwartek": 4,
      "piatek": 5,
      "sobota": 6,
      "niedziela": 7
    }

    daysActive.sort( (a,b) => {
      const day1 = a.toLowerCase();
      const day2 = b.toLowerCase()
      return order[day1] > order[day2];
    })

    this.setState({ daysActive })
  }

  static getDerivedStateFromProps(props, state){
    return {
      daysActive: props.repeat
    }
  }

  componentWillUnmount(){
    this.props.unMount(this.state.daysActive)
  }

  render() {
    return (
      <div className='popup'>
        <div className='popup__inner'>
        <div className="popup__inner__title">Repeat</div>
          {this.state.days.map( (elem, i) => (
            <div key={elem} className="popup__inner__row">
              <div className="popup__inner__row__day">
                <span>{elem}</span>
              </div>
              <div className="popup__boxDiv">
                <input id={`popup__checkbox${i}`} className="popup__checkbox" type="checkbox" onClick={this.onToogle} checked={this.state.daysActive.includes(elem)} name={`${elem}`}></input>
                <label htmlFor={`popup__checkbox${i}`}></label>
                {/*}<input type="checkbox" name={`${elem}`} onClick={this.onToogle}
                  checked={this.state.daysActive.includes(elem)}></input>{*/}
              </div>
            </div>
          ))}
        <button className="popupClose" onClick={this.props.closePopup}>&times;</button>
        </div>
      </div>
    );
  }
}

export default Popup;
