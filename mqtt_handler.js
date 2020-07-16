// https://github.com/mqttjs/MQTT.js#connect

// Event 'connect'
//  function (connack) {}
//    Emitted on successful (re)connection (i.e. connack rc=0).
//    connack received connack packet. When clean connection option is false and server has a previous session for clientId connection option, then connack.sessionPresent flag is true. When that is the case, you may rely on stored session and prefer not to send subscribe commands for the client.

// Event 'reconnect'
//  function () {}
//    Emitted when a reconnect starts.

// Event 'close'
//  function () {}
//    Emitted after a disconnection.

// Event 'disconnect'
//  function (packet) {}
//    Emitted after receiving disconnect packet from broker. MQTT 5.0 feature.

// Event 'offline'
//  function () {}
//    Emitted when the client goes offline.

// Event 'error'
//  function (error) {}
//    Emitted when the client cannot connect (i.e. connack rc != 0) or when a parsing error occurs.
//    The following TLS errors will be emitted as an error event:
//      ECONNREFUSED
//      ECONNRESET
//      EADDRINUSE
//      ENOTFOUND

// Event 'end'
//  function () {}
//    Emitted when mqtt.Client#end() is called. If a callback was passed to mqtt.Client#end(), this event is emitted once the callback returns.

// Event 'message'
//  function (topic, message, packet) {}
//    Emitted when the client receives a publish packet
//      topic topic of the received packet
//      message payload of the received packet
//      packet received packet, as defined in mqtt-packet

// Event 'packetsend'
//  function (packet) {}
//    Emitted when the client sends any packet. This includes .published() packets as well as packets used by MQTT for managing subscriptions and connections
//
//  - packet received packet, as defined in https://github.com/mcollina/mqtt-packet

// Event 'packetreceive'
//  function (packet) {}
//    Emitted when the client receives any packet. This includes packets from subscribed topics as well as packets used by MQTT for managing subscriptions and connections
//
//  - packet received packet, as defined in https://github.com/mcollina/mqtt-packet


var client = mqtt.connect('wss://test.mosquitto.org:8081')

client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

