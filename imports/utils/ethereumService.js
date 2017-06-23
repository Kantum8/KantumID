import _ from 'lodash';
import sha3 from 'solidity-sha3';
import bitcore from 'bitcore-lib';


// KantumID contract info
const contractAbi =
[{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"ipfsHash","type":"string"},{"name":"inReplyToId","type":"bytes32"},{"name":"inReplyToIpfsHash","type":"string"}],"name":"sendData","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"bytes32"},{"name":"publicKey","type":"string"}],"name":"registerUser","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"username","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"publicKey","type":"string"}],"name":"BroadcastPublicKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"datalId","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":true,"name":"inReplyToId","type":"bytes32"},{"indexed":false,"name":"inReplyToIpfsHash","type":"string"}],"name":"SendData","type":"event"}];
const contractAddress = '0xEA83b57Dcee187705F281aA79df051C393611E42';


if(typeof web3 === 'undefined') {
  console.log('Metamask not detected');
} else {
  var kantumidContract = web3.eth.contract(contractAbi).at(contractAddress);
}

// Public functions to be exported
const ethereumService = {
  initialize(callback) {
    if(typeof web3 === 'undefined') {
      console.log("Metamask not detected");
      return callback(false);
    } else {
    // DEV env
      web3.eth.getTransaction('0x058f91867894499d7c113ef4e2ff2af1613f764a1e43227f46ea54b908e414d9', (error, result) => {
        if(result == null) {
          console.log(`Web3 error: ${error}`);
          return callback(false);
        } else {
          //var kantumidContract = web3.eth.contract(contractAbi).at(contractAddress);
          callback(true);
        }
      });
    }
  },
  // Get Ethereum address of the current user
  getOwnerEthereumAddress() {
    return web3.eth.accounts[0]
  },
 // Check if current MetaMask user has already registered an account
  checkIfUserExists(callback) {
    const broadcastPublicKeyEvent = kantumidContract.BroadcastPublicKey({addr: web3.eth.accounts[0]}, {fromBlock: 0, toBlock: 'latest'});

    broadcastPublicKeyEvent.get((error, events) => {
      if(!events.length) {
        return callback(null, Session.set('userNotFound', true));
      } else {
        const userInfo = {
          "username": web3.toAscii(events[0].args.username),
          "startingBlock" : events[0].blockNumber
        };
        return callback(null, Session.set('userFound', userInfo));
      };
    });
  },
  // Generate key pair
  generateKeyPair(userData, callback) {
    web3.eth.sign(web3.eth.accounts[0], "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", (error, result) => {
      const privateKey = bitcore.PrivateKey.fromString(result.slice(2, 66));
      return callback(null, privateKey.toString());
    });
  },
// Create new Ethereum account for the user
  registerUser(username, callback) {
    web3.eth.sign(web3.eth.accounts[0], "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", (error, result) => {
      const privateKey = bitcore.PrivateKey.fromString(result.slice(2, 66));
      const publicKey = bitcore.PublicKey.fromPrivateKey(privateKey);
      console.log(publicKey.toString());

      kantumidContract.registerUser(username, publicKey.toString(), (error, result) => {
        if(error) {
          console.log(`Registration error: ${error}`);
          callback(error, null);
        } else {
          web3.eth.getBlockNumber((error, latestBlock) => {
            if(error) {
              return callback(error, null);
            }

            const userData = {
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
  getUsersPublicKey(data, callback) {
    const broadcastPublicKeyEvent = kantumidContract.BroadcastPublicKey({username: web3.fromAscii(data)}, {fromBlock: 0, toBlock: 'latest'});

    broadcastPublicKeyEvent.get((error, events) => {
      //if(!events.length) {
      if(typeof events.length === 'undefined') {
        return callback("User not found", null);
      } else {
        const result = {
          'address' : events[0].args.addr,
          'publicKey' : events[0].args.publicKey
        };

        callback(null, result);
      }
    });
  },
  // Listen for the incoming emails for the given address
    watchForIncomingData(startBlock, callback) {
      const sendEvent = kantumidContract.SendData({to: web3.eth.accounts[0]}, {fromBlock: startBlock, toBlock: 'latest'});

      console.log(`Watching from block: ${startBlock}`);

      sendEvent.watch((error, event) => {
        console.log(`Got incoming data ${JSON.stringify(event)}`);
        callback(event);
      });

      return sendEvent;
    },
// Emit new data contract event
  writeData(toAddress, ipfsHash, inReplyToIpfsHash, callback) {
    const inReplyTo = inReplyToIpfsHash != null ? sha3.default(inReplyToIpfsHash) : 0;
    inReplyToIpfsHash = inReplyToIpfsHash != null ? inReplyToIpfsHash : 'null';

    console.log(`Trying to call sendData with toAddress=${toAddress}, hash=${ipfsHash}, inReplyTo=${inReplyTo}, inReplyToIpfsHash=${inReplyToIpfsHash}`);

    kantumidContract.sendData(toAddress, ipfsHash, inReplyTo, inReplyToIpfsHash, (error, result) => {
      if (error) {
        console.log(`Could not execute sendData() contract function!${error}`);
        return callback(`Could not execute sendData() contract function!${error}`, null);
      } else {
        console.log(`sendData result is ${result}`);
        callback(null, result);
      }
    });
  }
};

export default ethereumService;
