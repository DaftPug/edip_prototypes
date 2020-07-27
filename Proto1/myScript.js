navigator.geolocation.watchPosition((position) => {
    console.log(position);
    data.latitude = position.coords.latitude;
    data.longitude = position.coords.longitude;
});

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

var data = {latitude: 0, longitude: 0, type: null, id: ""};
var mqtt_client = () => {};

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
    let clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
    data.id = clientId;
    let options = {
        keepalive: 10,
        clientId: clientId,
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
            }
        });
        stopLoadScreen();
        setInterval(publishData(mqtt_client), 1000);
    });

    // React to recieving a message
    mqtt_client.on("message", function (topic, message) {
        // message is Buffer
        recieveMessage(message);
    });
}

function recieveMessage(message) {
    console.log("Recieved message - trying to parse it");
    let temp = JSON.parse(message.toString());
    console.log("Parse succesful:");
    console.log(temp);
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
    console.log(spinner);
    console.log(document.body);
    // html_body.removeChild(spinner);

    spinner.parentNode.removeChild(spinner);
    // spinner.remove();
}
