// 0 = Eclipse, 1 = Hive, 2 = Mosquitto, 3 = Influx
let chooseBroker = 3;
let myTopic = "dit_gruppenummer_her"; //PLEASE REMEMBER TO CHANGE THIS
let topicPath ="ituF2020/EXPD/"; //DON'T CHANGE THIS
let chosenTopic = topicPath+myTopic;
let generatedID = "id" + parseInt(Math.random() * 100000, 10);

let brokerList = [];

let knownBrokers = [
    'mqtt.eclipse.org,80,false',
    'broker.hivemq.com,8000,false',
    'test.mosquitto.org,8081,true',
    'influx.itu.dk,9002,true'

];
for(let i = 0; i < knownBrokers.length; i++){
    //console.log(knownBrokers[i]);
    let keys = knownBrokers[i].split(",");
    let usesHTTPS = false;
    if(keys[2] === "true"){
        usesHTTPS = true;
    }
    let broker_info = {
        name: keys[0],
        port: Number(keys[1]),
        secured: usesHTTPS,
    }
    brokerList[i] = broker_info;
}