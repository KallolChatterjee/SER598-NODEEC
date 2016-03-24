// simple socket server
var net = require('net');
var EventEmitter = require('events').EventEmitter;
var total = 0;
var lumberjack = new EventEmitter();
var calculator = new EventEmitter();
var clients = {};
var clientId,cmd,value;
function display(lumberDisplay) {
    console.log(lumberDisplay);
}
lumberjack.on('lumberjack', display);



function checkClient(clientId,cmd, value, sock){
  console.log('ClientID : ' + clientId);
  if (clientId === "ASU") {
    setTimeout(function () {
	findTotal(cmd, value, sock, clientId);
    }, 30000);
  } else if (clientId === "UA") {
    setImmediate(function(){
	findTotal(cmd, value, sock, clientId);
    });

  } else if (clientId === "NAU") {
    lumberjack.emit('lumberjack', 'I saw a lumberjack!');
	findTotal(cmd, value, sock, clientId);
  }
}

function findTotal(cmd,value,sock,clientId){

}

var server = net.createServer(function (sock) {
    console.log("Incoming connection accepted");
    sock.on('data', function (d) {
      var dataset = d.toString().split(" ");
      clientId = dataset[0];
      cmd = dataset[1];
      value =dataset[2];
      checkClient(clientId,cmd, value,sock);
    }).on('error', function (e) {
	console.log("Some kind of server error" + e);
    });
}).listen(3000);
