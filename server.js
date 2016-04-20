const http = require('http');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;

const server = http.createServer(app).listen(port, () => {
  console.log('Listening on port ' + port + '.');
});

module.exports = server;


// WEBSOCKETS //

var votes = {};


const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);
  socket.emit('statusMessage', 'You have connected.');
  io.sockets.emit('usersConnected', io.engine.clientsCount);


  socket.on('message', (channel, message) => {
    if (channel === 'voteCast') {
      votes[socket.id] = message;
      var time = new Date();
      socket.emit('yourVote', {vote: message, time: time.toLocaleString() });
      socket.emit('voteCount', countVotes(votes));
    }
  });


  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
    delete votes[socket.id];
    socket.emit('voteCount', countVotes(votes));
    io.sockets.emit('usersConnected', io.engine.clientsCount);
  });
});

function countVotes(votes) {
var voteCount = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
};
  for (var vote in votes) {
    voteCount[votes[vote]]++;
  }
  return voteCount;
}
