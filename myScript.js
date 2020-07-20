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
  Global variables
*/

// TODO: update lists with current positions of other clients
var fugitive_list = [];
var hunter_list = [];

// For wss to work, needed by itu, port 8081 has to be used
var client = mqtt.connect("wss://test.mosquitto.org:8081");
var mqtt_topic = "hotncold1337";

/*
  Geolocation - Essentiel for prototype, but Nice-to-have
  https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

  TODO: update coordinates
  TODO: send information through MQTT
  TODO: recieve information about other clients through MQTT
*/

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
}

function error() {
  status.textContent = "Unable to retrieve your location";
}

if (!navigator.geolocation) {
  status.textContent = "Geolocation is not supported by your browser";
} else {
  status.textContent = "Locating…";
  navigator.geolocation.getCurrentPosition(success, error);
}

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
class Client {
  // TODO: publish clients latitude and longitude via the MQTT network
  publishPosition(position) {}
}

/*
  Server - Nice-to-Have

  Clients:
  TODO: Keep track of amount of hunters and fugitives
  TODO: Assign roles to clients depending on amount of hunters and fugitives

  Map:
  TODO: show a live map detailing the routes, that the hunters and fugitives take
*/

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

// Example MQTT code
client.on("connect", function () {
  client.subscribe(mqtt_topic, function (err) {
    if (!err) {
      client.publish(mqtt_topic, "Hello mqtt");
    }
  });
});

// Example MQTT code
client.on("message", function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
});
