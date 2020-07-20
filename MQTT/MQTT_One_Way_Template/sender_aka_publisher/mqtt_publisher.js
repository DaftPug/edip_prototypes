// ORIGINAL FILENAME: "moja_mqtt2020.js"

// SETUP MQTT ------------------------------------------

//Find åbne broker her: https://github.com/mqtt/mqtt.github.io/wiki/public_brokers
let connectToBrokerNumber = chooseBroker;
console.log("Trying to connect to: ", brokerList[connectToBrokerNumber]);

const broker = brokerList[connectToBrokerNumber].name;
const port = brokerList[connectToBrokerNumber].port;
const secured = brokerList[connectToBrokerNumber].secured;
const topic = chosenTopic;
const myID = generatedID;

// DISPLAY INFO IN HTML ---------------------------------
document.getElementById("brokerName").innerText = broker;
let httpConnectiontype = "no";
if (secured == true) {
  httpConnectiontype = "yes";
}
document.getElementById("security").innerText = httpConnectiontype;

// CONNECT ----------------------------------------------

let mqttClient = new Paho.MQTT.Client(broker, port, myID);

mqttClient.connect({ onSuccess: onConnect, useSSL: secured });
mqttClient.onConnectionLost = conLost;

// MQTT Handler functions--------------------------------

function onConnect() {
  console.log("Connected");
  document.getElementById("brokerName").className = "info-if-connected";
  document.getElementById("security").className = "info-if-connected";
  document.getElementById("connectionStatus").className = "info-if-connected";
  document.getElementById("connectionStatus").innerHTML = "connected";
  mqttClient.subscribe(topic);
}

function sendMQTT(message) {
  console.log("sending");
  let mOBJ = { deviceID: myID, content: message };
  let mSend = new Paho.MQTT.Message(JSON.stringify(mOBJ));
  mSend.destinationName = topic;
  document.getElementById("data").innerText = "Sending: " + mOBJ.content;
  console.log("Sending: " + mOBJ.content);
  mqttClient.send(mSend);
}

function conLost() {
  document.getElementById("brokerName").className = "info-if-not-connected";
  document.getElementById("security").className = "info-if-not-connected";
  document.getElementById("connectionStatus").className =
    "info-if-not-connected";
  document.getElementById("connectionStatus").innerText = "no connection";
  console.log("Lost connection");
}
