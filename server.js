const axios = require('axios');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const functions = require('./functions.js');
const app = express();



app.use(cors());

app.use(express.static(path.join(__dirname, 'front-end/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("app server listening on" + port);
});




// API call
app.post('/axios', (req, res) => {
    res.set('Content-Type', 'text/json');
    const lat = req.body.lat;
    const lon = req.body.lon;
    console.log("lat: " + lat);
    console.log("lon: " + lon);

    const url = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&cnt=16&appid=b3da3c9942f24bac56e8898c51e03757';

    console.log("url: "+ url);
    
    axios.get(url).then(json => {
        let arrLength = json.data.list.length;
        let tempArray = [];
        
        let city = json.data.city.name;
        console.log("city: " + city);
        let country = json.data.city.country;      
        
        for (i = 0; i < arrLength; i++) {
            let x = json.data.list[i].main.temp;
            x = Math.floor(x);
            tempArray.push(x);
        };
        

        // functions
        let mean = functions.meanFunc(tempArray);
        console.log("mean: " + mean);
        let median = functions.medianFunc(tempArray);
        console.log("median in kelvin: " + median);
        let n = [];
        n = functions.modeFunc(tempArray);
        n = n[0];
        console.log("mode in kelvin: " + n);
        console.log(tempArray);
        
        
        res.send({ mean: mean, median: median, mode: [n], city: city, country: country });

    }).catch(error => {
    console.log("this is the error: " + error.response);
    res.send({ error: error.response });
    });
    
});


module.exports = app;