// Setup empty JS object to act as endpoint for all routes
const sentimentData = {};

var path = require('path')
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const dotenv = require('dotenv')

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

//connect to aylien API
  var AYLIENTextAPI = require("aylien_textapi");

  let textapi = new AYLIENTextAPI({
      application_id: process.env.API_ID,
      application_key: process.env.API_KEY
    });
  


const textEntries = [];
  //post route adds entry 

app.post('/add', addEntry);

  function addEntry(req,res){
    // console.log(req.body);
    textEntry = {
        text: req.body.text
    };
  
    // textEntries.push(textEntry)
    // console.log(textEntries);


    textapi.sentiment({
        'text': textEntry.text,
        'mode' : 'document'
      }, function(error, response) {
        if (error === null) {
          // console.log(response);
          textEntries.push(response)
          res.send(response)
          console.log(textEntries);
        }
      });
  }



app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})


