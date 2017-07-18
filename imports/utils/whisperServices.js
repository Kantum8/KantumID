/*/var net = require('net');
import net from 'net';
//var Web3 = require('./src/index.js'); var web3 = new Web3(new Web3.providers.IpcProvider('/Users/frozeman/Library/Ethereum/geth.ipc', net));
//var Web3 = require('./src/index.js');
import Web3 from 'web3';
var web3 = new Web3(new Web3.providers.IpcProvider('https://61ca1159.ngrok.io', net));
var shh = web3.shh;

var identities = [];
var subscription = null;


var whisperServices = {
	username:     "<not set>",
	topic:        "0xfeedbabe",
	key:          "",
	identity:     "",
	pollInterval: null,
	filter:       null,

	setUsername: function(name) {
		this.username = name;
		return true;
	},

	join: function(password) {
		// create key from shared secret
		this.key = shh.generateSymKeyFromPassword(password);

		// create pub/priv key for identity
		this.identity = shh.newKeyPair();

		pubKey = shh.publicKey(this.identity);
		console.log("identity", pubKey.substr(2, 8));

		// create message filter (console doesn't support subscriptions)
		this.filter = shh.newMessageFilter({
			symKeyID: this.key,
			topics:   [this.topic],
		});

		// poll for new messages
		me = this;
		this.pollInterval = setInterval(function() {
			me.pollMessages()
		}, 1000);

		this.say("joined");

		return true;
	},

	pollMessages: function() {
		messages = shh.getFilterMessages(this.filter);
		for (i = 0; i < messages.length; i++) {
			printMessage(messages[i], this.username);
		}
	},

	say: function(text) {
		message = {
			symKeyId: this.key,
			topic: this.topic,
			payload: web3.toHex(this.username + ": " + text),
			powTime: 5,
			powTarget: shh.info.minPow,
			sig: this.identity
		};

		return shh.post(message);
	},

	leave: function() {
		shh.deleteMessageFilter(this.filter);
		clearInterval(this.pollInterval);
		this.say("left...")
		console.log("chat room left");
		return true;
	}
}

// start helper functions
function time(message) {
	date = new Date(message.timestamp * 1000);
	hours = date.getHours();
	minutes = "0" + date.getMinutes();
	seconds = "0" + date.getSeconds();

	return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

function sender(message) {
	return message.sig.substr(2, 8)
}

function printMessage(message, myUsername) {
	line = web3.toAscii(message.payload);
	parts = line.split(":");
	name = parts[0]
	if (name !== myUsername) {
		console.log("[" + time(message) + " " + name + "/" + sender(message) + "]" + parts.slice(1).join(":"));
	}
}
export default whisperServices;



//const whisperServices = {
  Promise.all([
      shh.newSymKey().then((id) => {identities.push(id);}),
      shh.newKeyPair().then((id) => {identities.push(id);})
  ]).then(() => {
      return shh.getPublicKey(identities[1]);
  }).then((id) => {
      identities.push(id);
  }).then(() => {
      subscription = shh.subscribe("messages", {
          symKeyID: identities[0],
          topics: ['0xffaadd11']
      }).on('data', console.log);

  }).then(() => {
     shh.post({
          symKeyID: identities[0],
          sig: identities[1],
          ttl: 10,
          topic: '0xffaadd11',
          payload: '0xffffffdddddd1122',
          powTime: 3,
          powTarget: 0.5
      })
  });
//};

//export default whisperServices;
/*

var shh = web3.shh;
var appName = "My silly app!";
var myName = "Gav Would";
var myIdentity = shh.newIdentity();

shh.post({
  "from": myIdentity,
  "topics": [ web3.fromAscii(appName) ],
  "payload": [ web3.fromAscii(myName), web3.fromAscii("What is your name?") ],
  "ttl": 100,
  "priority": 1000
});

var replyWatch = shh.watch({
  "topics": [ web3.fromAscii(appName), myIdentity ],
  "to": myIdentity
});
// could be "topic": [ web3.fromAscii(appName), null ] if we wanted to filter all such
// messages for this app, but we'd be unable to read the contents.

replyWatch.arrived(function(m)
{
	// new message m
	console.log("Reply from " + web3.toAscii(m.payload) + " whose address is " + m.from);
});

var broadcastWatch = shh.watch({ "topic": [ web3.fromAscii(appName) ] });
broadcastWatch.arrived(function(m)
{
  if (m.from != myIdentity)
  {
    // new message m: someone's asking for our name. Let's tell them.
    var broadcaster = web3.toAscii(m.payload).substr(0, 32);
    console.log("Broadcast from " + broadcaster + "; replying to tell them our name.");
    shh.post({
      "from": eth.key,
      "to": m.from,
      "topics": [ eth.fromAscii(appName), m.from ],
      "payload": [ eth.fromAscii(myName) ],
      "ttl": 2,
      "priority": 500
    });
  }
});

var identity = web3.shh.newIdentity(function(err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
var topic = 'example';
var payload = 'hello whisper world!';

var message = {
  from: identity,
  topics: [topic],
  payload: payload,
  ttl: 100,
  workToProve: 100 // or priority TODO
};

/*
"network,admin,db,eth,net,web3,personal,shh"
geth --verbosity 0 console --rinkeby --rpc --rpcapi "network,net,web3,shh" --shh -light --lightkdf --rpccorsdomain "http://localhost:8545"

curl -X POST \
-H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "shh_version", "params": []}' \
"https://61ca1159.ngrok.io"
*/
