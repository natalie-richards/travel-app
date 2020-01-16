const geoNames = 'http://api.geonames.org/searchJSON?q=';
const userName = 'natatat31';
let longLatData = [];

let time = document.getElementById('date-search').value;
console.log(time);

//get API data
const getLongLat = async (geoNames, city, user)=>{

    const res = await fetch(geoNames + city + '&maxRows=10&cities=cities1000&username=' + userName)
    try {
  
      const longLat = await res.json();
      console.log(longLat)
        
      return longLat;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
};


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
    // console.log(newData);
    return newData;

  }catch(error) {
    console.log("error", error)
  }
}

const getLongLatResponse = async ()=>{

    const request = await fetch('/getLongLat')

    try {
        const firstData = await request.json();

        longLatData.push(firstData[0]);
        
        return firstData;
    
    } catch(error) {
        console.log("error", error)
    }
};


// const getWeather = async ()=>{
//     console.log(longLatData);



//     const res = await fetch(darkSky + key + '/' + lat + ',' + long , { mode: 'no-cors' })
//     console.log(res)
    
//     try {
//         const weatherData = await res.json();
//         return weatherData;

//     } catch(error) {

//     }
// };


function apiCall(event) {
    event.preventDefault();
    
    const citySearch = document.getElementById('city-search').value;
    // console.log(citySearch);
    
    getLongLat(geoNames, citySearch, userName)
        
        .then(function(data){
    
            postLongLat('/addLongLat', {  
                city: data.geonames[0].name, 
                state: data.geonames[0].adminCode1, 
                country: data.geonames[0].countryName,
                lng:  data.geonames[0].lng,
                lat:  data.geonames[0].lat
            }

        );
    
    })
        .then(function(data){
        
            getLongLatResponse()

    })
    //     .then(function(data){
            
    //         getWeather()

    // })
}






export { apiCall }