// Setup basic express server
var express = require('express');
var app = express();
const fs = require('fs');
var server = require('http').createServer(app);

// // Include Nodejs' net module.
// const Net = require('net');
// const port1 = 2150;
// var  host = '0.0.0.0';
// // The port number and hostname of the server.
//
// app.get('/changeIP',function(req,res,next){
//   fs.writeFile('ipconvowall.txt', req.query.ip, function (err) {
//     if (err) throw err;
//     console.log('Saved!');
//     fs. readFile('ipconvowall.txt', 'utf8', function(err, contents) {
//       host=contents;
//       res.send("saved");
//     });
//   });
//
// })

app.get('/ip',function(req,res,next){
  res.sendFile(__dirname + '/public/ip.html');

})


// Create a new TCP client.
// function send(msg){
//   console.log("came here with "+msg +" to ip"+host);
//   const client = new Net.Socket(); // Send a connection request to the server.
//   client.connect({ port: port1, host: host }, function() {
//     // If there is no error, the server has accepted the request and created a new // socket dedicated to us.
//     console.log('TCP connection established with the server.');
//     //msg.replace("[{",'+"["+"{');msg.replace("]}",'}"+"]"+');
//     // The client can now send data to the server by writing to its socket.
//     client.write(msg);
//   });
//
//   client.on('end', function() {
//     console.log('Requested an end to the TCP connection');
//   });
//   client.on('error', function() {
//     console.log('error');
//   });
//
// }
//send("HAPPY");

var PAYLOAD = {'sentiment': 'yyy'};
var UNICODE_PAYLOAD = {'인삼': '★ 뿌리 ★'};
// Travis currently does not support Buffer.from
function getBuffer(array) {
  var buffer = new Buffer(array.length);
  for (var i = 0; i < array.length; i++) {
    buffer[i] = array[i];
  }
  return buffer;
}
var BINARY_DATA = getBuffer([255, 255, 255]);
var BINARY_PAYLOAD = {
  'data': BINARY_DATA,
  'array': [getBuffer([238]), getBuffer([221])]
}




// New:
var io = require('socket.io')(server);
var port = process.env.PORT || 5010;


var multer  =   require('multer');
var loc=__dirname;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));


var newSocket;
io.on('connection', function (socket) {
  console.log("connected");
  socket.emit('fSentiment', 'Happy');



  newSocket=socket;
  socket.on('voice_sentiment', function(payload, fn) {
    console.log("got voice sentiment");
    console.log(payload);
    if (fn) fn(payload);

    socket.broadcast.emit("vSentiment",payload);
  });

  socket.on('face_sentiment', function(payload, fn) {
    console.log("got face msg");
    console.log(payload);
    if (fn) fn(payload);
    console.log("emoji: ",payload.toString());
    //send(payload.toString());
    socket.broadcast.emit("fSentiment",payload.toString());
  });

  socket.on('twitter_sentiment', function(payload, fn) {

    if (fn) fn(payload);
    console.log("got twitter msg");
    console.log(payload.toString());
    //send(JSON.stringify(payload));
    socket.broadcast.emit("fSentiment",payload);
  });

});


app.get('/home',function(req,res,next){
  res.sendFile(__dirname + '/public/home.html');
})
