// Global variables
const id = "bigbrother_" + Math.random().toString(16).substr(2, 8);
var mqtt_client = () => {};
var if_connected = false;
var known_peers = new Map();
var peer_proximity = new Map();

var bot_coordinates = [
  { latitude: 55.659499, longitude: 12.591931 },
  { latitude: 55.659445, longitude: 12.59191 },
  { latitude: 55.659423, longitude: 12.591892 },
  { latitude: 55.659349, longitude: 12.591882 },
  { latitude: 55.659349, longitude: 12.591852 },
];
var bot_list = [];

class FakePerson {
  constructor(id, lat, long) {
    this.publish = this.publish.bind(this);
    this.connect = this.connect.bind(this);
    this.data = {
      id: id,
      latitude: lat,
      longitude: long,
      time: Date.now(),
    };

    this.mqtt_client = () => {};

    console.log("FakePerson created", this.data.id);
  }

  connect() {
    let options = {
      keepalive: 10,
      clientId: this.data.id,
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
    let broker = "wss://test.mosquitto.org:8081";
    this.mqtt_client = mqtt.connect(broker, options);
  }

  get client() {
    return this.mqtt_client;
  }

  get getData() {
    return this.data;
  }

  set getData(new_data) {
    this.data.id = new_data.id;
    this.data.latitude = new_data.latitude;
    this.data.longitude = new_data.longitude;
    this.data.time = Date.now();
  }

  publish(client, data) {
    let buf = buffer.Buffer.from(JSON.stringify(data));
    let mqtt_topic = "hotncold1337";
    console.log("" + data.id + " trying to publish!");
    client.publish(mqtt_topic, buf);
  }
}

function createBots(list) {
  let i = 1;
  bot_coordinates.forEach((element) => {
    let bot_name = "test_id_0" + i;
    i++;
    let new_bot = new FakePerson(bot_name, element.latitude, element.longitude);
    bot_list.push(new_bot);
  });
}

function connectBots(bot_list) {
  bot_list.forEach((element) => {
    element.connect();
  });
}

function startBots(bot_list) {
  bot_list.forEach((element) => {
    publishBot(element);
  });
}
function publishBot(bot) {
  bot.publish(bot.client, bot.getData);

  // setTimeout(publishBot(bot), 3000);
}

// Test setup
// known_peers.set("test_id_1", {
//   latitude: 55.659313,
//   longitude: 12.591852,
//   time: Date.now(),
// });

// known_peers.set("test_id_2", {
//   latitude: 55.659489,
//   longitude: 12.591914,
//   time: Date.now(),
// });

function placeholder() {
  for (const [key, value] of known_peers.entries()) {
    console.log("!!!!! HEJ !!!!!!");
    console.log(key, value);
    temp_data = known_peers.get(key);
    dist = getDistanceBetweenCoords(
      latitude,
      longitude,
      temp_data.latitude,
      temp_data.longitude
    );
    meters = Math.floor(dist * 1000);
    console.log("Distance:", meters);

    console.log("!!!!! FARVEL !!!!!!");
    if (meters < dist_threshold) {
      dangerzone++;
    }
  }
}

// Get distance in KM between to coordinate sets
function getDistanceBetweenCoords(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d;
}

// Distance helper function
function deg2rad(deg) {
  return deg * (Math.PI / 180);
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
    mqtt_client.subscribe(mqtt_topic, { nl: true }, function (err) {
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
    console.log("Disconnected");
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
  let lat = temp.latitude;
  let long = temp.longitude;
  // let dist = getDistanceBetweenCoords(lat1, lon1, lat2, lon2)
  known_peers.set(temp.id, {
    latitude: lat,
    longitude: long,
    time: Date.now(),
  });
  console.log("Recieved:", temp);
  console.log(known_peers);
}

function updateTable() {
  let table_element = document.getElementById("table");
  if (table_element == null) {
    createTable(table_element);
  } else {
    deleteTable(table_element);
    createTable(table_element);
  }
  createTableHead(table_element);
}

function createTableHead(table_element) {
  let t_head = document.createElement("div");
  t_head.setAttribute("class", "rTableHeading");

  let t_id = document.createElement("div");
  t_id.setAttribute("class", "rTableHead");
  let text = document.createTextNode("ID");
  t_id.appendChild(text);
  t_head.appendChild(t_id);

  let t_latlong = document.createElement("div");
  t_latlong.setAttribute("class", "rTableHead");
  text = document.createTextNode("Lat & Long");
  t_latlong.appendChild(text);
  t_head.appendChild(t_latlong);

  let t_ppl_within_threshold = document.getElementById("div");
  t_ppl_within_threshold.setAttribute("class", "rTableHead");
  text = document.createTextNode("People who are too close");
  t_ppl_within_threshold.appendChild(text);
  t_head.appendChild(t_ppl_within_threshold);

  table_element.appendChild(t_head);
}

function createTableRows(table_element) {
  let t_body = document.createElement("div");
  t_body.setAttribute("class", "rTableBody");
  for (const [key, value] of known_peers.entries()) {
  }
}

function createTable(table_element) {
  table_element = document.createElement("div");
  table_element.setAttribute("class", "rTable");
  table_element.setAttribute("id", "table");
}

function deleteTable(table_element) {
  table_element.parentNode.removeChild(table_element);
}

function scanProximity(peers) {
  let peer_list = initPeers();
  for (const [key, value] of known_peers.entries()) {
    console.log("!!!!! HEJ !!!!!!");
    console.log(key, value);
    temp_data = known_peers.get(key);
    dist = getDistanceBetweenCoords(
      latitude,
      longitude,
      temp_data.latitude,
      temp_data.longitude
    );
    meters = Math.floor(dist * 1000);
    console.log("Distance:", meters);

    console.log("!!!!! FARVEL !!!!!!");
    if (meters < dist_threshold) {
      dangerzone++;
    }
  }
}

function peerScan(peer_list) {}

function updatePeers(peer_one, peer_two) {
  let p_one_prox = peer_proximity.get(peer_one);
  let p_two_prox = peer_proximity.get(peer_two);
  peer_proximity.set(peer_one, p_one_prox++);
  peer_proximity.set(peer_two, p_two_prox++);
}

function initPeers() {
  let peer_list = [];
  for (const key of known_peers.entries()) {
    peer_list.push(key);
    peer_proximity.set(key, 0);
  }
  console.log("peer_proximity:", peer_proximity);
  console.log("peer_list:", peer_list);
  return peer_list;
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

// mqttConnect();
function run() {
  createBots(bot_coordinates);
  connectBots(bot_list);
  setInterval(() => {
    startBots(bot_list);
    console.log("this works!");
  }, 1000);
}

run();
