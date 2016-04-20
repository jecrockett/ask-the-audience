const socket = io();

// EVENT LISTENRES //
var connectionCount = document.getElementById('connection-count');
var statusMessage = document.getElementById('status-message');
var voteCount = document.getElementById('vote-count');
var yourVote = document.getElementById('your-vote');
var buttons = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    socket.send('voteCast', this.innerText);
  });
}

socket.on('usersConnected', (count) => {
  connectionCount.innerText = 'Connected Users: ' + count;
});

socket.on('statusMessage', (message) => {
  statusMessage.innerText = message;
});

socket.on('voteCount', (votes) => {
  voteCount.innerHTML = '';
  Object.keys(votes).forEach(appendVote.bind(votes));
});

socket.on('yourVote', (info) => {
  yourVote.innerText = `You voted for ${info.vote} at ${info.time}.`
})

function appendVote(option, index) {
  let newElem = document.createElement("li");
  newElem.innerHTML = option + ": " + this[option]
  voteCount.appendChild(newElem);
}
