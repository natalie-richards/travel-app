
const postData = async ( url = '', data)=>{

    let textInput = document.getElementById('article-input').value;
    console.log(textInput);

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
    console.log(newData);
    document.getElementById('results').innerHTML = "";

        let entry = document.createElement('div');
        entry.setAttribute('class', 'entry');

        let confidence = newData.polarity_confidence
        let percent = confidence * 100;
        let roundPercent = Math.round(percent);

        entry.innerHTML = 'This text is percieved as <strong>' + newData.polarity + '</strong> with ' + roundPercent + '% confidence';
        document.getElementById('results').append(entry);
    
    return newData;
  }catch(error) {
  console.log("error", error)
  }
}




function apiCall(event) {
    event.preventDefault();
    const textInput = document.getElementById('article-input').value;
    if (textInput === ""){
        let errorMessage = document.createElement('p');
        errorMessage.id = "error-flag";
        errorMessage.innerHTML = "Please enter in text";
        document.getElementById('text-input').append(errorMessage);
    }
    
        postData('/add', {
        text: textInput
            }
        )
}



export { apiCall
        }