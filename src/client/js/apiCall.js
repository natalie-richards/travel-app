const geoNames = 'http://api.geonames.org/searchJSON?q=';
const userName = 'natatat31';
let longLatData = [];
let weatherData = [];




function toUNIX(date){
    var convert = Date.parse(date);
    return convert/1000;
}


//Initial API call to return longitude and latitude for searched city
const getLongLat = async (geoNames, city, user)=>{

    const res = await fetch(geoNames + city + '&maxRows=10&cities=cities1000&username=' + userName)
    try {
  
      const longLat = await res.json();
        
      return longLat;
    }  catch(error) {
        console.log("error", error);
    }
};


const getPic = async (city)=>{

    const res = await fetch('https://pixabay.com/api/?key=14915160-98070184f300f226a30c7897b&q=' + city + '&image_type=photo')
    try {
  
      const picData = await res.json();

      let placeholder = document.getElementById('placeholder');

      if (document.body.contains(placeholder)){
        placeholder.remove();
      }
      let cityPic = document.getElementById('city-photo-container');
      cityPic.innerHTML = '<img class="city-pic" src="' + picData.hits[0].largeImageURL +'"/>';

      document.getElementById('results').style.backgroundColor = ('#fff');
        
      return picData;
    }  catch(error) {
        console.log("error", error);
    }
};

//Send data to server for additonal API call
const postLongLat = async ( url = '', data = {})=>{

    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header        
  });
  try {
    const newData = await response.json();
 
    return newData;

  }catch(error) {
    console.log("error", error)
  }
}


//Get initial data to display
const getLongLatResponse = async ()=>{

    const request = await fetch('/getLongLat')

    try {
        const firstData = await request.json();

        longLatData.unshift(firstData[0]);

        //fill in trip info

        let docCity = document.getElementById('destination');
        let docDate = document.getElementById('trip-date');
        docCity.innerHTML = longLatData[0].city + ', ' + longLatData[0].country;
        docDate.innerHTML = 'Departing on: ' + longLatData[0].date;

        //countdown

        const day = 1000 * 60 * 60 * 24;
        let date = longLatData[0].date + ' 00:00:00';
        let countDown = new Date(date).getTime();
        let now = new Date().getTime();
        let distance = countDown - now;

        document.getElementById('countdown').innerText = Math.floor(distance / (day)) + ' days left!';
  
        return longLatData;
    
    } catch(error) {
        console.log("error", error)
    }
};

const getWeatherResponse = async ()=>{

    const request = await fetch('/getWeather')

    try {
        const fullData = await request.json();

        weatherData.unshift(fullData);


        let docTemp = document.getElementById('temp');
        docTemp.innerHTML = 'The weather typically ranges from ' + weatherData[0][0].daily.data[0].temperatureLow + '&deg;F  to ' + weatherData[0][0].daily.data[0].temperatureHigh + '&deg;F ';
    
        return fullData;
    
    } catch(error) {
        console.log("error", error)
    }
};


function addToDoList(){
    //add notes area with event listener
 
    let notesButton = document.createElement('button');
    notesButton.setAttribute('id', 'note-button');
    notesButton.innerHTML = "Add Acitivity List";
    
    document.getElementById('results').append(notesButton);

    document.getElementById('note-button').addEventListener('click', showNotes);

} 

function showNotes(e){
    e.preventDefault();

    document.getElementById('note-button').remove();
    
    var listEntry = document.createElement('form');
    listEntry.setAttribute('id', 'todo-form');
    listEntry.innerHTML = '<input type="text" id="list-item" name="list-item" placeholder="To-do Item">' +
                          '<input id="add-item" type="submit" name="" value="Add Item">';
    
    document.getElementById('note-area').append(listEntry);

    document.getElementById('add-item').addEventListener('click', addItem);
}

function addItem(e){
    e.preventDefault();

    let itemToAdd = document.getElementById('list-item').value;
    let listArea = document.getElementById('list-area');
    let listItem = document.createElement('li');

    listItem.setAttribute('class', 'item-added');

    listItem.innerHTML = itemToAdd + '<span class="close">×</span>';

    listArea.append(listItem);


    let nodeList = document.getElementsByClassName('close');

        for(let i = 0 ; i < nodeList.length ; i++) {
            nodeList[i].onclick = function() {
                var x = this.parentElement;
                x.style.display = "none";
              }

        }

}




function apiCall(event) {
    event.preventDefault();
    
    const citySearch = document.getElementById('city-search').value;
    let date = document.getElementById('date-search').value;
    let timeStamp = toUNIX(date);

    getPic(citySearch)
    
    getLongLat(geoNames, citySearch, userName)
 
        
        .then(function(data){
    
            postLongLat('/addLongLat', {  
                city: data.geonames[0].name, 
                state: data.geonames[0].adminCode1, 
                country: data.geonames[0].countryName,
                lng:  data.geonames[0].lng,
                lat:  data.geonames[0].lat,
                time: timeStamp,
                date: date
            }

        );
    
    }).then(function(data){
        
            getLongLatResponse()

    }).then(function(data){
            setTimeout (function(){
                getWeatherResponse()
            }, 750)
    }).then(function(data){
        addToDoList()
    })

}






export { apiCall }