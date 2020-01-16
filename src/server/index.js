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

// console.log(__dirname)
let url = '';

const cityResults = [];
  //post route adds entry 

  app.post('/addLongLat', addLongLat);

function addLongLat(req,res){

    newTrip = {
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      long: req.body.lng,
      lat: req.body.lat
    }
  
    cityResults.push(newTrip);
    res.send(cityResults)
    console.log(cityResults);

    let long = cityResults[0].long;
    let lat = cityResults[0].lat;

    let darkSky = 'https://api.darksky.net/forecast/';
    let API_OPTIONS = {
      headers: { accept: 'application/json' },
      auth: {
        username: process.env.API_KEY,
      },
    };

    url = darkSky + process.env.API_KEY + '/' + lat + ',' + long
  console.log(url);


  fetch(url)
  .then(response => response.json() )
    .then(result => console.log(result) )
    .catch(error => console.log("error") );

  }
 



  app.get('/getLongLat', getData) 
  function getData (req, res){
    res.send(cityResults);
    console.log(cityResults);
  }



  



app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})


