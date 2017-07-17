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

web3.shh.post('message', function(err, result){
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});
personal.getListAccounts(function(err, result){
  if(err) {
    console.log(err);
  } else {
    console.log(result);
  }
});

geth --mine --rinkeby -rpcapi "network,admin,db,eth,net,web3,personal,ssh" --shh


personal.unlockAccount("0x501C9d92325c6240BEc5cBE18117d3b91eCc65F4")


curl -X POST \
-H "Content-Type: application/json" \
--data '{"jsonrpc": "2.0", "id": 1, "method": "ssh_newIdentity", "params": []}' \
"https://kovan.infura.io/5ysRjN9mODHFf7aqQqzp"


curl -X POST --data '{"jsonrpc":"2.0","method":"shh_version","params":[],"id":67}'
