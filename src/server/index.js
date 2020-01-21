// Setup empty JS object to act as endpoint for all routes
const cityData = {};

var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const dotenv = require('dotenv')
const fetch = require("node-fetch")

//used to hide API key
dotenv.config();

// Start up an instance of app
const app = express()

// Cors for cross origin allowance
app.use(cors())
// to use json
app.use(bodyParser.json())
// to use url encoded values
app.use(bodyParser.urlencoded({
  extended: false
}))

// Initialize the main project folder
app.use(express.static('dist'))


const cityResults = [];
const weatherResults = [];

  app.post('/addLongLat', addLongLat);

  function addLongLat(req,res){

      newTrip = {
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        long: req.body.lng,
        lat: req.body.lat,
        time: req.body.time,
        date: req.body.date
      }
    
      cityResults.unshift(newTrip);
      res.send(cityResults)

      //store data to pass in to Dark Sky API
      let long = cityResults[0].long;
      let lat = cityResults[0].lat;
      let time = cityResults[0].time;

      let darkSky = 'https://api.darksky.net/forecast/';
      let API_OPTIONS = {
        headers: { accept: 'application/json' },
        auth: {
          username: process.env.API_KEY,
        },
      };

      //Build fetch URL
      url = darkSky + process.env.API_KEY + '/' + lat + ',' + long + ',' + time

      //Fetch Weather Data
        fetch(url)
        .then(response => response.json() )
          .then(result => 
              weatherResults.unshift(result)       
              )

            .catch(error => console.log("error") );

    }
  

    app.get('/getLongLat', getData) 
    function getData (req, res){
      res.send(cityResults);
      console.log(cityResults);
    }

    app.get('/getWeather', getWeatherData) 
    function getWeatherData (req, res){
      res.send(weatherResults);
      console.log(weatherResults);
    }



app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})


