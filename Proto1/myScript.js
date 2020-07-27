// Global variables
const id = "mqttjs_" + Math.random().toString(16).substr(2, 8);
console.log("My ID:", id);
document.getElementById("myid").innerText = id;
var mqtt_client = () => {};
var if_connected = false
var known_peers = new Map();
var dist_threshold = 30;
var device_threshold = 3;
let currentTest = test1;

var warningSound = new Audio('Clock.mp3');

function setTest(element){
    currentTest = element.id
    console.log("Current test:", currentTest);
}

function soundPlay(){
    setInterval(warningSound.play(), 2000) 
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

// Get permission and start location updates
function start() {
    //When the start-button is pressed, hide the button
    document.getElementById("startbutton").style.display = "none";

    // iOS13 device
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState == 'granted') {
                    mqttConnect();
                    startLocationUpdate();
                }
            })
            .catch(console.error);
    }
    // Android and other unsafe devices :P
    else {
        mqttConnect();
        startLocationUpdate();
    }
}

function startLocationUpdate() {
    if (navigator.geolocation) {
        var options = {
            timeout: 60000,
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
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    // Update UI
    document.getElementById("lat").innerText = latitude;
    document.getElementById("lon").innerText = longitude;

    let data = {
        latitude: latitude,
        longitude: longitude,
        id: id
    };
    if (if_connected) {
        publishData(mqtt_client, data);
    }

    let dangerzone = 0

    for (const [key, value] of known_peers.entries()) {
        console.log("!!!!! HEJ !!!!!!")
        console.log(key, value)
        temp_data = known_peers.get(key)
        dist = getDistanceBetweenCoords(latitude, longitude, temp_data.latitude, temp_data.longitude)
        meters = Math.floor(dist * 1000)
        console.log("Distance:", meters)

        console.log("!!!!! FARVEL !!!!!!")
        if (meters < dist_threshold) {
            dangerzone++
        }

        if (dangerzone > dist_threshold) {
            //shit hits the fan!
        }
        document.getElementById("dangerzone").innerText = "Dangerzone counter: " + dangerzone;

    }
    console.log("People in the dangerzone", dangerzone)
    console.log("My position:", latitude, longitude)

    // 1. Udregn antal i dangerzone

    // 2. Publish på topic

    //Run functions below here. They will update everytime the GPS coordinates updates.
    //sammenligneDistancer(latitude, longitude);
    //distance();
}

function errorHandler(err) {
    if (err.code == 1) {
        alert("Error: Access is denied!");
    } else if (err.code == 2) {
        alert("Error: Position is unavailable!");
    }
}

// Get distance in KM between to coordinate sets
function getDistanceBetweenCoords(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

// Distance helper function
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

// For Spinner
var opts = {
    id: "spinny",
    lines: 20, // The number of lines to draw
    length: 38, // The length of each line
    width: 17, // The line thickness
    radius: 45, // The radius of the inner circle
    scale: 1, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    // color: '#ffffff', // CSS color or array of colors
    color: [
        "#ff7a7a",
        "#ff9447",
        "#ffd17a",
        "#ffeb7a",
        "#feed6d",
        "#f1ff5c",
        "#67f25a",
        "#3afdbf",
        "#95e9e2",
        "#7abdff",
        "#7a7aff",
        "#c67aff",
    ], // CSS color or array of colors
    fadeColor: "transparent", // CSS color or array of colors
    speed: 1, // Rounds per second
    rotate: 0, // The rotation offset
    animation: "spinner-line-shrink", // The CSS animation name for the lines
    direction: 1, // 1: clockwise, -1: counterclockwise
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: "spinner", // The CSS class to assign to the spinner
    top: "50%", // Top position relative to parent
    left: "50%", // Left position relative to parent
    shadow: "0 0 1px transparent", // Box-shadow for the lines
    position: "absolute", // Element positioning
};

function mqttConnect() {
    let options = {
        keepalive: 10,
        clientId: id,
        protocolId: "MQTT",
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        will: {
            topic: "WillMsg",
            payload: "Connection Closed abnormally..!",
            qos: 1,
            retain: false,
        },
    };
    // Connect to MQTT
    broker = "wss://test.mosquitto.org:8081";
    mqtt_client = mqtt.connect(broker, options);
    mqtt_topic = "hotncold1337";

    console.log("Attempt to connect to broker");
    startLoadingScreen(broker);
    mqtt_client.on("connect", function () {
        console.log("Connected to MQTT broker, trying to subscribe to topic");
        mqtt_client.subscribe(mqtt_topic, {nl: true}, function (err) {
            if (err) {
                console.log("Error while subscribing");
            } else {
                console.log("Subscription succesful");
                if_connected = true;
            }
        });
        stopLoadScreen();
    });

    // React to recieving a message
    mqtt_client.on("message", function (topic, message) {
        // message is Buffer
        recieveMessage(message);
    });
    mqtt_client.on("disconnect", function () {
        // message is Buffer
        // recieveMessage(message);
        console.log("Disconnected")
    });
}

function publishData(client, data) {
    // console.log(latitude);
    // console.log(longitude);
    // console.log("Trying to publish the following:", data)
    let buf = buffer.Buffer.from(JSON.stringify(data));
    client.publish(mqtt_topic, buf);
    // mqtt_client.publish(mqtt_topic, data);
    console.log("Published:", data);
    // client.end();
}

function recieveMessage(message) {
    let temp = JSON.parse(message.toString());
    if (temp.id != id) {
        let lat = temp.latitude;
        let long = temp.longitude
        // let dist = getDistanceBetweenCoords(lat1, lon1, lat2, lon2)
        known_peers.set(temp.id,
            {
                latitude: lat,
                longitude: long,
                time: Date.now()
            });
        console.log("Recieved:", temp);
        console.log(known_peers);
    }

    // Check distance

    // If inside danger zone, add to array
    // Else ignore
}

function startLoadingScreen(broker) {
    console.log("Starting loading Screen");
    let body = document.body;
    let loadingText = document.createElement("h1");
    let text = document.createTextNode("Connecting to " + broker);
    loadingText.appendChild(text);
    let div = document.createElement("div");
    div.setAttribute("id", "spinny");
    div.append(loadingText);
    body.append(div);
    let spinner = new Spin.Spinner(opts).spin(div);
    // setTimeout(stopLoadScreen, 5000);
    // spinner.start();
}

function stopLoadScreen() {
    console.log("Stopping loading Screen");
    let spinner = document.getElementById("spinny");
    // html_body.removeChild(spinner);

    spinner.parentNode.removeChild(spinner);
    // spinner.remove();
}

