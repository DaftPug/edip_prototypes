/*jshint esversion: 6 */
/***** Brainstorm

  En prøver at finde en person via en skærm, som ændrer farve efter hvor tæt på personen er, en anden prøver at flygte, ved at mærke telefonens vibrationer, som indikerer, at personen kommer tættere på.

  Opsætning:
    - 2+ klienter, som kommunikerer igennem en broker
      - klienterne skal begge oprette forbindelse til brokeren på rette kanal
    - kommunikationen skal være to-vejs, da klienter løbende skal både sende sin position og modtage information om de resterende klienters position
    - GPS skal benyttes og virke på samtlige klienter, da viden om deres position er afhængig af dette
    - vibration:
      - klienterne, som forsøger at undgå fangeren, registrerer, at fangeren er tættere på ved hjælp af telefonens vibrationer
    - skærm:
      - fangeren får information om den er tættere eller længere væk fra en klient via farven på skærmen

  Tanker:
    - Hvordan fastholdes klienternes fokus på mobilen og ikke bare ved at kigge rundt?
      - De skal løse små opgaver for at få "meter at gå" og hvis de ikke løser en opgave, så står deres klient fast og kan blive fanget af fangeren
        - Hvis en klient, både fanger og jagtede, går videre uden at have løst en opgave, skal klienten tilbage og 'hente' sig selv
*/

/*
  Geolocation - Essentiel for prototype, but Nice-to-have
  https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

  TODO: update coordinates
  TODO: send information through MQTT
  TODO: recieve information about other clients through MQTT
*/

/*
  Actuators - Need-to-have

  Vibration(Fugitives):

  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
  TODO: Make the phone vibrate
  TODO: Make the phone vibrate as a heartbeat
  TODO: Make the heart beat faster or slower depending on the hunters distance

  Screen(Hunter):
  TODO: Make the phones screen show a color
  TODO: Make the phones screen pulse between hot'n'cold colors
  TODO: Make the pulses depend on the distance between hunter and fugitives
*/

/*
  Clients - Need-to-have

  TODO: implement two kinds: Hunter & Fugitive
  TODO: keep track of two list of positions: Hunters & Fugitives other than yourself
  TODO: implement the ability to switch from one type to the other
  TODO: implement to go through the list of clients of the opposite type and react to the client that is closest

  Hunters:

  Fugitives:

*/
var fugitive_list = [];
var hunter_list = [];
var data = { latitude: 0, longitude: 0, type: null, id: "" };
var mqtt_client = () => {};

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
// Creating the new spinner

navigator.geolocation.watchPosition((position) => {
  console.log(position);
  data.latitude = position.coords.latitude;
  data.longitude = position.coords.longitude;
});

// Using https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
// as the basis for this function
// TODO: test if example works
// TODO: Fix code if it fails

function turnOn() {
  mqttConnect();
  setTimeout(() => {
    setInterval(publishData, 1000);
  }, 7000);
}

// TODO: publish clients latitude and longitude via the MQTT network
function publishData(client) {
  // console.log(latitude);
  // console.log(longitude);
  let buf = buffer.Buffer.from(JSON.stringify(data));
  client.publish(mqtt_topic, buf);
  // mqtt_client.publish(mqtt_topic, data);
  console.log("Data published succesfuly");
}

// TODO: establish connection to the mqtt_client
// TODO: subcribe to topic on the mqtt_client
// TODO: prevent subscriber from recieving own published messages

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
    mqtt_client.subscribe(mqtt_topic, { nl: true }, function (err) {
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

// TODO: implement a method for client to continualy recieve messages
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

/*
  Server - Nice-to-Have

  Clients:
  TODO: Keep track of amount of hunters and fugitives
  TODO: Assign roles to clients depending on amount of hunters and fugitives

  Map:
  TODO: show a live map detailing the routes, that the hunters and fugitives take
*/
class Server {
  constructor(params) {}

  createMap(x1, y1, x2, y2) {}
}

/*
  MQTT - Need-to-have
  https://github.com/mqttjs/MQTT.js

  TODO: implement publishing from clients
  TODO: implement clients subscribing to a topic
  TODO: implement that clients don't recieve their own publications

  MQTT + Geo:
  TODO: clients publish their latitude and longitude
  TODO: clients recieve other clients latitude and longitude
  TODO:
*/

mqttConnect();
// turnOn();
