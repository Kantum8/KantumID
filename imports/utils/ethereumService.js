/*
PROD ENV
PROD ENV
PROD ENV
*/
import _ from 'lodash';
import sha3 from 'solidity-sha3';
import bitcore from 'bitcore-lib';

// Define User

// KantumID contract info

// KantumID contract env
var contractAbi =
[{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"ipfsHash","type":"string"},{"name":"inReplyToId","type":"bytes32"},{"name":"inReplyToIpfsHash","type":"string"}],"name":"sendData","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"bytes32"},{"name":"publicKey","type":"string"}],"name":"registerUser","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"username","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"publicKey","type":"string"}],"name":"BroadcastPublicKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"datalId","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":true,"name":"inReplyToId","type":"bytes32"},{"indexed":false,"name":"inReplyToIpfsHash","type":"string"}],"name":"SendData","type":"event"}]
var contractAddress = '0xEA83b57Dcee187705F281aA79df051C393611E42'
/*
var contractAbi =
[{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"ipfsHash","type":"string"},{"name":"inReplyToId","type":"bytes32"},{"name":"inReplyToIpfsHash","type":"string"}],"name":"sendData","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"bytes32"},{"name":"publicKey","type":"string"}],"name":"registerUser","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"username","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"publicKey","type":"string"}],"name":"BroadcastPublicKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"emailId","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":true,"name":"inReplyToId","type":"bytes32"},{"indexed":false,"name":"inReplyToIpfsHash","type":"string"}],"name":"SendData","type":"event"}];

var contractAddress = '0x9857b51206bedf50ef56359847b6f431f3ba2d0a';

// LemonMail contract
var contractAbi = [{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"bytes32"},{"name":"publicKey","type":"string"}],"name":"registerUser","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"ipfsHash","type":"string"},{"name":"inReplyTo","type":"bytes32"},{"name":"inReplyToIpfsHash","type":"string"}],"name":"sendEmail","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"username","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"publicKey","type":"string"}],"name":"BroadcastPublicKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"emailId","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":true,"name":"inReplyToId","type":"bytes32"},{"indexed":false,"name":"inReplyToIpfsHash","type":"string"}],"name":"SendEmail","type":"event"}];
var contractAddress = '0x6154E4F9795387628C1a1D6A3FC0C79523D12A13';*/


if(typeof web3 === 'undefined') {
  console.log('Metamask not detected');
} else {
  var kantumidContract = web3.eth.contract(contractAbi).at(contractAddress);
}

// Public functions to be exported
var ethereumService = {
  initialize: function(callback) {
    if(typeof web3 === 'undefined') {
      console.log("Metamask not detected");
      return callback(false);
    } else {
    // DEV env
    web3.eth.getTransaction('0x058f91867894499d7c113ef4e2ff2af1613f764a1e43227f46ea54b908e414d9', function(error, result) {
      if(result == null) {
        console.log("Web3 error: " + error);
        return callback(false);
      } else {
        //var kantumidContract = web3.eth.contract(contractAbi).at(contractAddress);
        callback(true);
      }
    });
  }
  },
  // Get Ethereum address of the current user
  getOwnerEthereumAddress: function() {
    return web3.eth.accounts[0]
  },
  // Check if current MetaMask user has already registered an account
  checkIfUserExists: function(callback) {
    var broadcastPublicKeyEvent = kantumidContract.BroadcastPublicKey({addr: web3.eth.accounts[0]}, {fromBlock: 0, toBlock: 'latest'});

    broadcastPublicKeyEvent.get(function(error, events) {
      if(!events.length) {
        return callback(null);
      } else {
        return callback({
          "username": web3.toAscii(events[0].args.username),
          "startingBlock" : events[0].blockNumber
        });
      };
    });
  },
  // Generate key pair
  generateKeyPair: function(userData, callback) {
    web3.eth.sign(web3.eth.accounts[0], "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", function(error, result) {
      var privateKey = bitcore.PrivateKey.fromString(result.slice(2, 66));
      return callback(privateKey.toString());
    });
  },
// Create new Ethereum account for the user
  registerUser: function(username, callback) {
    web3.eth.sign(web3.eth.accounts[0], "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", function(error, result) {
      var privateKey = bitcore.PrivateKey.fromString(result.slice(2, 66));
      var publicKey = bitcore.PublicKey.fromPrivateKey(privateKey);
      console.log(publicKey.toString());

      kantumidContract.registerUser(username, publicKey.toString(), function(error, result) {
        if(error) {
          console.log("Registration error: " + error);
          callback(error, null);
        } else {
          web3.eth.getBlockNumber(function(error, latestBlock) {
            if(error) {
              return callback(error, null);
            }

            var userData = {
              "username": username,
              "privateKey" : privateKey.toString(),
              "startingBlock" : latestBlock
            };

            callback(null, userData);
          });
        }
      });
    });
  },
// Find public key belonging to the user with given username
  getUsersPublicKey: function(data, callback) {
    var broadcastPublicKeyEvent = kantumidContract.BroadcastPublicKey({username: web3.fromAscii(data)}, {fromBlock: 0, toBlock: 'latest'});

    broadcastPublicKeyEvent.get(function(error, events) {
      //if(!events.length) {
      if(typeof events.length === 'undefined') {
        return callback("User not found", null);
      } else {
        var result = {
          'address' : events[0].args.addr,
          'publicKey' : events[0].args.publicKey
        };

        callback(null, result);
      }
    });
  },
  // Get emails for the given folder. Limit the number of emails by given batch size using given block number as the upper block limit
    getEmailsFolder: function(folder, batchSize, startingBlock, upperBlockLimit, callback) {
      if (upperBlockLimit == null) {
        web3.eth.getBlockNumber(function(error, latestBlock) {
          findBatchOfEmails(folder, batchSize, startingBlock, latestBlock, 128, {}, function(emailsData, oldestEmailBlock) {
            var upperBlockLimit = oldestEmailBlock != null ? oldestEmailBlock - 1 : null;
            callback(emailsData, upperBlockLimit, latestBlock, folder);
          });
        });
      } else {
        findBatchOfEmails(folder, batchSize, startingBlock, upperBlockLimit, 128, {}, function(emailsData, oldestEmailBlock) {
          var upperBlockLimit = oldestEmailBlock != null ? oldestEmailBlock - 1 : null;
          callback(emailsData, upperBlockLimit, null, folder);
        });
      }
    },
  // Fetch replies for the email with given ID
    getEmailReplies: function(emailId, correspondentAddress, startingBlock, callback) {
      var replyEvent = kantumidContract.SendData({from: correspondentAddress, inReplyToId: emailId}, {fromBlock: startingBlock, toBlock: 'latest'});

      console.log("Getting replies for " + emailId);

      replyEvent.get(function(error, events) {
        var result = [];

        for (var i = 0; i < events.length; i++) {
          result.push({ ipfsHash: events[i].args.ipfsHash, transactionHash: events[i].transactionHash });
        }

        callback(result);
      });
    },
  // Listen for the incoming emails for the given address
    watchForIncomingEmails: function(startBlock, callback) {
      var sendEvent = kantumidContract.SendData({to: web3.eth.accounts[0]}, {fromBlock: startBlock, toBlock: 'latest'});

      console.log("Watching from block: " + startBlock);

      sendEvent.watch(function(error, event) {
        console.log("Got incoming data " + JSON.stringify(event));
        callback(event);
      });

      return sendEvent;
    },
// Emit new data contract event
  writeData: function(toAddress, ipfsHash, inReplyToIpfsHash, callback) {
    var inReplyTo = inReplyToIpfsHash != null ? sha3.default(inReplyToIpfsHash) : 0;
    inReplyToIpfsHash = inReplyToIpfsHash != null ? inReplyToIpfsHash : 'null';

    console.log("Trying to call sendData with toAddress=" + toAddress + ", hash=" + ipfsHash + ", inReplyTo=" + inReplyTo + ", inReplyToIpfsHash=" + inReplyToIpfsHash);

    kantumidContract.sendData(toAddress, ipfsHash, inReplyTo, inReplyToIpfsHash, function(error, result) {
      if (error) {
        console.log("Could not execute sendData() contract function!" + error);
        return callback("Could not execute sendData() contract function!" + error, null);
      } else {
        console.log("sendData result is " + result);
        callback(null, result);
      }
    });
  }
};

module.exports = ethereumService;
