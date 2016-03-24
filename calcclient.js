var sock = require('net').Socket();
sock.on('data', function(data) {
	console.log('Response: ' + data);
	sock.destroy();
	sock.end();
}).on('error', function(){
	console.log('Error connecting to server');
});
sock.on('close', function() {
	console.log('Connection closed');
});
// now make a request
sock.connect(3000);
sock.write(process.argv.slice(2, 5).join(' '));
