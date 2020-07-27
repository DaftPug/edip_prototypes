

//Parkeringspladsen "The Magic COVID location"
//var coordLat = 55.6593730
//var coordLon = 12.5916872

//Oppe ved vores bord
var coordLat = 55.6594453;
var coordLon = 12.5907759;

var goodDistance = true;

var distanceTime = 0;

//Random sound files can go here
let mySound = document.getElementById("myAudioPlayer");
/*
document.addEventListener("click", mouseClick)
function mouseClick(e){
    soundPlay();
}
*/

//Audio goes in here. We mainly just need 1 sound, 1 song, or the likes.
function soundPlay(){
    var clapYay = new Audio('sounds/Clap.mp3');
    mySound = clapYay;
    mySound.play();
}

function distance(){
    document.getElementById("vibrate").innerText = "You're a good citizen"
    if(goodDistance == true){
        
        if(distanceTime > 0){
            //Code for the exiting the circle goes here.
               
            distanceTime = 0;
        }
    } else if(goodDistance == false){
        //Code for entering a circle goes here... e.g. vibration, sound, alarms, light
        document.getElementById("vibrate").innerText = ("Get out you wet napkin")
        console.log("Jeg ryster")
        distanceTime++;
        
        window.navigator.vibrate(200)
        //alert("You are too close to a dangerous place, get out")
    }
}

function sammenligneDistancer(lat, long){

        console.log("Lat:", lat, "Long:", long)

        var distanceInM = Math.floor(getDistanceFromLatLonInKm(lat, long, coordLat, coordLon)*1000)
        
        console.log("Distance in meters: " + distanceInM);
        document.getElementById("distance").innerText = distanceInM;

        if(distanceInM < 20){
            goodDistance = false
        } else if(distanceInM > 20){
            goodDistance = true;
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