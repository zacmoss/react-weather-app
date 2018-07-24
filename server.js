const axios = require('axios');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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
    //const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=a25d87dd6745e2efea515ec201da00e9';
    const url = 'https://samples.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=10&appid=b1b15e88fa797225412429c1c50c122a1';
    //const url = 'https://samples.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&cnt=14&appid=a25d87dd6745e2efea515ec201da00e9';
    //const url = 'https://history.openweathermap.org/data/2.5/history/city?lat=' + lat + '&lon=' + lon + '&type=hour&start=1530835200&end=1532044800&appid=a25d87dd6745e2efea515ec201da00e9'

    
    meanFunc = (array) => {
        const arrLength = array.length;
        const sum = array.reduce((a, b) => a + b, 0);
        const average = sum / arrLength;
        return average;
    };

    medianFunc = (array) => {
        let median = 0;
        const arrLength = array.length;
        array = array.sort(function(a, b){return a-b});
        if (
            arrLength % 2 === 0
        ) {
            median = (array[arrLength / 2 - 1] + array[arrLength / 2]) / 2;
        } else {
            median = array[(arrLength - 1) / 2];
        }
        return median;
    };

    modeFunc = (array) => { 
        let max = 0;
        let mode = [];
        let str = array.sort();
        str = "~" + str.join('~~') + "~"
        str.replace( /(~-*\d+~)\1*/g, function(a, b
        ) {
            var m = a.length / b.length;
            if (max <= m ) {
                if (max < m) {mode = [];max = m;}
                mode.push( b.replace(/~/g,""));
            } 
        });
        return mode;
    }
    console.log("url: "+ url);
    
    axios.get(url).then(json => {
        let arrLength = json.data.list.length;
        let tempArray = [];
        //console.log(tempArray);
        
        for (i = 0; i < arrLength; i++) {
            let temp = json.data.list[i].temp.day;
            tempArray.push(temp);
        };
        

        // functions
        let mean = meanFunc(tempArray);
        let median = medianFunc(tempArray);
        let mode = modeFunc(tempArray);
        
        res.send({ mean: mean, median: median, mode: mode });

    }).catch(error => {
    console.log("this is the error: " + error.response);
    res.send({ error: error.response });
    });
    
});


module.exports = app;