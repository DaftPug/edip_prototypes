

//Parkeringspladsen "The Magic COVID location"
//var coordLat = 55.6593730
//var coordLon = 12.5916872

//Oppe ved vores bord
var coordLat = 55.6594453;
var coordLon = 12.5907759;

var goodDistance = true;
var badDistance = false;

var distanceTime = 0;

var warningSound = new Audio('sounds/Clock.mp3');
mySound = warningSound;    
//Audio goes in here. We mainly just need 1 sound, 1 song, or the likes.
function soundPlay(){
    setInterval(mySound.play(), 2000) 
}
function constantVibrate(){
    setInterval(window.navigator.vibrate(1000), 1000);
}
function smallIntervalVibrate(){
    setInterval(window.navigator.vibrate(400), 2000);
}
function bigIntervalVibrate(){
    setInterval(window.navigator.vibrate(200), 2000);
}
//Three functions to harass the players for 
function Distance(){ //

    if(goodDistance){ //This is the good distance "function"
        document.getElementById("MessageToUser").innerText = "You're keeping a good distance, good job";
            if(distanceTime > 0){
                alert("You were in a dangerous spot. Good job moving away from the danger!");
                distanceTime = 0;
        }
    } else if(!goodDistance){ //This is for a warning before it gets too bad
            document.getElementById("MessageToUser").innerText = "You need to get away from all these people";
            distanceTime += 0.1;
            //soundPlay(); //This is for sound test case
            //constantVibrate();
            //smallIntervalVibrate();
    } else if(badDistance){ //This is for when shit hits the fan, and the user needs to get out right away
            document.getElementById("MessageToUser").innerText = "Beam me up Scotty! It's dangerous in here!";
            distanceTime += 0.1;
            //soundPlay(); //This is for sound test case
            //constantVibrate();
            //bigIntervalVibrate();
    }
    
}

function sammenligneDistancer(lat, long){

        console.log("Lat:", lat, "Long:", long)

        var distanceInM = Math.floor(getDistanceFromLatLonInKm(lat, long, coordLat, coordLon)*1000)
        
        console.log("Distance in meters: " + distanceInM);
        document.getElementById("distance").innerText = "Distance in meters: " + distanceInM;
        
        //Measures the distancing between points/players. Can be written in whatever way or form, just needs to call the "Distance();" function
        var topLim = 20; // Top Limit Distance
        var botLim = 10; // Minimum Limit Distance
        if(distanceInM > topLim){
            Distance();
        } else if(distanceInM < topLim && distanceInM >= botLim){
            Distance();
        } else if(distanceInM < botLim){
            Distance();
        }
} 

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km

    return d;
}
  
function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


//GPS Coords code
function start() {
    //When the start-button is pressed, hide the button
    document.getElementById("startbutton").style.display = "none";

    // iOS13 device   
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
        .then(permissionState => {
            if (permissionState == 'granted') {
                startLocationUpdate();
            }
        })
        .catch(console.error);
    }
    // Android and other unsafe devices :P
    else {
        startLocationUpdate();
    }
}

function startLocationUpdate(){        
    if(navigator.geolocation){
       var options = {
            timeout:60000,
            maximumAge: 10000,
            enableHighAccuracy: true
        };
       geoLoc = navigator.geolocation;
       watchID = geoLoc.watchPosition(success, errorHandler, options);
    } else {
       alert("Sorry, browser does not support geolocation!");
    }
 }
//GPS works, can put functions in there
 function success(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    

    //Run functions below here. They will update everytime the GPS coordinates updates.
    sammenligneDistancer(latitude, longitude);
    distance();

 }
 
 function errorHandler(err) {
    if(err.code == 1) {
       alert("Error: Access is denied!");
    } else if( err.code == 2) {
       alert("Error: Position is unavailable!");
    }
 }