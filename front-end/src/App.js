import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import img from './images/test3.png';


/* ---- Discussion ----

We do an axios request to the server which then hits the api with the coordinates we
passed through from here. Then, the server responds with temperature data provided
by the api. We then update the state with that data. Parts of the page are then
conditionally rendered once those state variables are no longer undefined.

For the geolocation button we use geolocation to grab the user's coordinates and
updates the state variables to display those coordinates, which in turn updates
the input values, which are what the onSubmit button grabs to send to the server
and api.

We are creating 'controlled inputs' when we set the value of the lat and lon inputs
to the state variables. So, they become uneditable on changes. Due to this, we have
to create onChange handlers for both inputs where when we make changes the state
is redefined, thus also redfining the value of the inputs.

*/

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      temp: undefined,
      mean: undefined,
      median: undefined,
      mode: undefined,
      city: undefined,
      country: undefined,
      error: undefined,
      geoLatitude: "00",
      geoLongitude: "00"
    }
  }
  
/*
  state = {
    temp: undefined,
    mean: undefined,
    median: undefined,
    mode: undefined,
    city: undefined,
    country: undefined,
    error: undefined,
    geoLatitude: undefined,
    geoLongitude: undefined,
    test: 25
  }
  */

  onSubmit = (e) => {
    e.preventDefault();

    this.setState(() => ({ 
      city: undefined,
      country: undefined,
      error: undefined,
      mean: undefined,
      median: undefined,
      mode: undefined
    }));

    let lat = e.target.elements.lat.value;
    let lon = e.target.elements.lon.value;

    let data = {
      "lat": lat,
      "lon": lon
    }

    // axios post request
    const self = this;
    axios.post('/axios', data)
    .then(function(response){

      console.log('mean response: ' + response.data.mean);
      let mean = response.data.mean;
      let median = response.data.median;
      let mode = response.data.mode;

      if (mean) {
        mean = (1.8 * (mean - 273) + 32).toFixed(2);
        median = (1.8 * (median - 273) + 32).toFixed(2);
        mode = (1.8 * (mode - 273) + 32).toFixed(2);
      }    

      let city = response.data.city;
      let country = response.data.country;
      self.setState(() => ({
        mean: mean,
        median: median,
        mode: mode,
        city: city,
        country: country
      }));
      
      console.log("error returned: " + response.data.error);
    })
    .catch(function(err){
      console.log("error: " + err.response);
    });

    if (!lat || !lon) {
      this.setState(() => ({ error: "Please enter both coordinates." }));
    } else {
      this.setState(() => ({ error: undefined }));
    }
  }

  render() {
    return (
      <div className="app-main">
        <header className="app-header">
          <h1>
            Weather App
          </h1>
        </header>
        <div className="row">
          <div className="app-body">
            <p><i>Enter latitude and longitude for forecasted temperatures.</i></p>
            <form onSubmit={this.onSubmit}>
              <div className="row">
                <div className="input-container">
                  <p>Latitude</p>
                  <input name="lat" value={this.state.geoLatitude} onChange={(e) => {this.onChangeLat(e.target.value)}}></input>
                </div>
                <div className="input-container">
                  <p>Longitude</p>
                  <input name="lon" value={this.state.geoLongitude} onChange={(e) => {this.onChangeLon(e.target.value)}}></input>
                </div>
                <button className="submitButton">Check</button>
                <div className="geoButton" title="Click to set coordinates to current location" onClick={() => {this.geoLocationHandler()}}>
                  <img src={img} height="25px" width="25px"></img>
                </div>
              </div>
            </form>

            {this.state.error && <p className="error"><i>{this.state.error}</i></p>}
            {this.state.city && <p className="city"><strong>{this.state.city}, {this.state.country}</strong></p>}
            {this.state.mean && <p><span className="forecast">16 Day Forecast</span></p>}
            {this.state.mean && <p>Mean: {this.state.mean} &#8457;</p>}
            {this.state.median && <p>Median: {this.state.median} &#8457;</p>}
            {this.state.mode && <p>Mode: {this.state.mode} &#8457;</p>}
          </div>
        </div>
      </div>
    );
  }
  onChangeLat(val) {
    this.setState(() => ({geoLatitude: val}));
  }
  onChangeLon(val) {
    this.setState(() => ({geoLongitude: val}));
  }
  geoLocationHandler() {
    let self = this;
    navigator.geolocation.getCurrentPosition(function(position) {
      let lat = position.coords.latitude.toFixed(2);
      let lon = position.coords.longitude.toFixed(2);
      self.setState(() => ({geoLatitude: lat, geoLongitude: lon}));
    })
  }
}

export default App;
