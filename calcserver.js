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
calculator.on('calculator', findTotal);

function writeData(sock, clientId, message) {
  sock.write(message, function() {
    console.log("Message for client '", clientId, "': ", message);
    console.log("Finished response to client");
  });
}


function checkClient(clientId,cmd, value, sock){
  console.log('ClientID : ' + clientId);
  if (clientId === "ASU") {
    setTimeout(function () {
	  calculator.emit('calculator', cmd, value, sock, clientId);
    }, 30000);
  } else if (clientId === "UA") {
        //setImmediate
    process.nextTick(function(){
	  calculator.emit('calculator', cmd, value, sock, clientId);
    });

  } else if (clientId === "NAU") {
    lumberjack.emit('lumberjack', 'I saw a lumberjack!');
	  calculator.emit('calculator', cmd, value, sock, clientId);
  }
else{
    calculator.emit('calculator', cmd, value, sock, clientId);
  }
}

function findTotal(cmd,value,sock,clientId){
  if (clients[clientId] === undefined) {
    clients[clientId] = 0;
  }
    if(cmd === undefined){
      writeData(sock, clientId, 'Invalid request specification');
      return;
    }

  if (cmd === "q") {
      console.log("Available data as of now : ");
      for (key in clients) {
        console.log(key, clients[key]);
      }
      console.log('Connection closed by Client');
      sock.end("Good Bye !!! \n");
      server.close();
      return;
  } else {

    var total = clients[clientId];

    if (!value.match(/^\d+$/)) {
      writeData(sock, clientId, 'Invalid request specification');
      return;
    }

    value = parseInt(value, 10);

    if (cmd === "a") {
        total += value;
    } else if (cmd === "m") {
        total -= value;
    } else if (cmd === "s") {
        total = value;
    } else{
        writeData(sock, clientId, 'Invalid request specification');
        return;
    }

    clients[clientId] = total;

    writeData(sock, clientId, total.toString());
  }
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
