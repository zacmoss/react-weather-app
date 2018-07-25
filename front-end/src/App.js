import React, { Component } from 'react';
import axios from 'axios';
import fire from './fire.png';
import './App.css';

// need to do ajax request to server to send lat and lon inputs
// then server needs to make api call with that data
// then on completion server needs to send api data back to front-end
// then front-end needs to display that info



class App extends Component {
  state = {
    lat: undefined,
    lon: undefined,
    temp: undefined,
    mean: undefined,
    median: undefined,
    mode: undefined,
    city: undefined,
    error: undefined,
  }

  componentDidMount(){
    
  };
  


  onSubmit = (e) => {
    e.preventDefault();

    let lat = e.target.elements.lat.value;
    let lon = e.target.elements.lon.value;

    let data = {
      "lat": lat,
      "lon": lon
    }

    this.setState(() => ({ lat: undefined }));
    this.setState(() => ({ lon: undefined }));
    this.setState(() => ({ city: undefined }));
    this.setState(() => ({ temp: undefined }));
    this.setState(() => ({ error: undefined }));
    this.setState(() => ({ mean: undefined }));
    this.setState(() => ({ median: undefined }));
    this.setState(() => ({ mode: undefined }));


    // axios post request
    const self = this;
    axios.post('/axios', data)
    .then(function(response){
      
      let mean = response.data.mean;
      //console.log("returned mean: " + response.data.mean);
      let median = response.data.median;
      //console.log("returned median: " + response.data.median);
      let mode = (response.data.mode);
      //console.log("returned mode: " + mode);
      
      mean = (1.8 * (mean - 273) + 32).toFixed(2);
      median = (1.8 * (median - 273) + 32).toFixed(2);
      mode = (1.8 * (mode - 273) + 32).toFixed(2);
      self.setState(() => ({ mean: mean }));
      self.setState(() => ({ median: median }));
      self.setState(() => ({ mode: mode }));      

      
      let city = response.data.city;
      self.setState(() => ({ city: city }));
      
    })
    .catch(function(error){
      console.log(error);
    });

  }

  render() {
    return (
      <div className="app-main">
        <header className="app-header">
          <h1>
            Weather App
          </h1>
        </header>
        <div className="app-body">
          <p><i>Check the current temperature anywhere on Earth</i></p>
          <form onSubmit={this.onSubmit}>
            <div className="row">
              <div className="input-container">
                <p>Latitude</p>
                <input name="lat"></input>
              </div>
              <div className="input-container">
                <p>Longitude</p>
                <input name="lon"></input>
              </div>
              <button>Check</button>
            </div>
          </form>

          {this.state.error && <p>{this.state.error}</p>}
          {this.state.city && <p className="city"><strong>{this.state.city}</strong></p>}
          {this.state.temp && <p>Local Temp: {this.state.temp}</p>}
          {this.state.mean && <p><span className="forecast">16 Day Forecast</span></p>}
          {this.state.mean && <p>Mean: {this.state.mean} &#8457;</p>}
          {this.state.median && <p>Median: {this.state.median} &#8457;</p>}
          {this.state.mode && <p>Mode: {this.state.mode} &#8457;</p>}
        </div>
      </div>
    );
  }
}

export default App;
