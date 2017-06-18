import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import eth from '/imports/utils/ethereumService';

// Check which accounts are available and if defaultAccount is still available,
// Otherwise set it to localStorage, Session, or first element in accounts
function checkAccounts() {
  web3.eth.getAccounts((error, accounts) => {
    if (!error) {
      if (!_.contains(accounts, web3.eth.defaultAccount)) {
        if (_.contains(accounts, localStorage.getItem('address'))) {
          web3.eth.defaultAccount = localStorage.getItem('address');
        } else if (_.contains(accounts, Session.get('address'))) {
          web3.eth.defaultAccount = Session.get('address');
        } else if (accounts.length > 0) {
          web3.eth.defaultAccount = web3.eth.accounts[0];
        } else {
          web3.eth.defaultAccount = undefined;
        }
      }
      localStorage.setItem('address', web3.eth.defaultAccount);
      Session.set('address', web3.eth.defaultAccount);
      Session.set('accounts', accounts);
    }
  });
}

// DEV env
var contractAbi = [{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"username","type":"bytes32"},{"name":"publicKey","type":"string"}],"name":"registerUser","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"ipfsHash","type":"string"},{"name":"inReplyTo","type":"bytes32"},{"name":"inReplyToIpfsHash","type":"string"}],"name":"sendEmail","outputs":[{"name":"result","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"administrator","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"username","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"publicKey","type":"string"}],"name":"BroadcastPublicKey","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"emailId","type":"bytes32"},{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"ipfsHash","type":"string"},{"indexed":true,"name":"inReplyToId","type":"bytes32"},{"indexed":false,"name":"inReplyToIpfsHash","type":"string"}],"name":"SendEmail","type":"event"}];
var contractAddress = '0x6154E4F9795387628C1a1D6A3FC0C79523D12A13';
var kantumidContract = web3.eth.contract(contractAbi).at(contractAddress);

// CHECK if user have a KantumID account
function checkIfUserExists(callback) {
  var broadcastPublicKeyEvent = kantumidContract.BroadcastPublicKey({addr: web3.eth.accounts[0]}, {fromBlock: 0, toBlock: 'latest'});
  broadcastPublicKeyEvent.get((error, events) => {
    //if(!events.length)
    if(events.length != 1) {
      Session.set('userNotFounded', true);
    } else {
      //return userInfo = {
      var userInfo = {
        "username": web3.toAscii(events[0].args.username),
        "startingBlock" : events[0].blockNumber
      }
      Session.set('userFounded', userInfo);
      if (typeof Session.get('connexionSigned') === 'undefined') {
        eth.generateKeyPair(userInfo.username, function(result, err){
          if (err) {
            console.log(err);
          } else {
            var Identity = {
              username: userInfo.username,
              privateKey: result,
              startingBlock: events[0].blockNumber
            };
            console.log(Identity);
            return Session.set('connexionSigned', Identity)
          }
        })
      } else {
        console.log('Session is ever signed');
      }
    }
  });
}/*
var Identity = {
  privateKey: 'result'
};

Session.set('connexionSigned', Identity)
*/
// Initialize everything on new network
function initNetwork(newNetwork) {
  checkAccounts();
  Session.set('network', newNetwork);
  Session.set('isConnected', true);
  Session.set('latestBlock', 0);
  Session.set('startBlock', 0);
 }


// CHECK FOR NETWORK
function checkNetwork() {
  /*if (typeof web3 === 'undefined') {
    console.log('Metamask not detected')
  } else {*/
eth.initialize(function(connected) {
    if(!connected) {
      console.log("Not connected to the Ethereum network");
      return true;
    } else {
  web3.version.getNode((error) => {
    const isConnected = !error;

    /*/Check if we are synced
    if (isConnected) {
      web3.eth.getBlock('latest', (e, res) => {
        if (res.number >= Session.get('latestBlock')) {
          Session.set('outOfSync', e != null || (new Date().getTime() / 1000) - res.timestamp > 600);
          Session.set('latestBlock', res.number);
          if (Session.get('startBlock') === 0) {
            console.log(`Setting startblock to ${res.number - 6000}`);
            Session.set('startBlock', (res.number - 6000));
          }
        } else {
          // XXX MetaMask frequently returns old blocks
          // https://github.com/MetaMask/metamask-plugin/issues/504
          console.debug('Skipping old block');
        }
      });
    }*/

    // Check which network are we connected to
    // https://github.com/ethereum/meteor-dapp-wallet/blob/90ad8148d042ef7c28610115e97acfa6449442e3/app/client/lib/ethereum/walletInterface.js#L32-L46
    if (!Session.equals('isConnected', isConnected)) {
      if (isConnected === true) {
        web3.eth.getBlock(0, (e, res) => {
          let network = false;
          if (!e) {
            switch (res.hash) {
              case '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9':
                network = 'kovan';
                Session.set('AVGBlocksPerDay', 21600);
                break;
              case '0x ...':
                network = 'ropsten';
                Session.set('AVGBlocksPerDay', 5760);
                break;
              case '0x ...':
                network = 'main';
                Session.set('AVGBlocksPerDay', 5760);
                break;
              default:
                network = 'private';
            }
          }
          if (!Session.equals('network', network)) {
            initNetwork(network, isConnected);
          }
        });
      } else {
        Session.set('isConnected', isConnected);
        Session.set('network', false);
        Session.set('latestBlock', 0);
      }
    }
  });
}
});
}




function initSession() {
  Session.set('network', false);
  Session.set('loading', false);
  Session.set('loadingProgress', 0);
  Session.set('outOfSync', false);
  Session.set('syncing', false);
  Session.set('isConnected', false);
  Session.set('latestBlock', 0);
}

/**
 * Startup code
 */
Meteor.startup(() => {
  initSession();
  checkNetwork();
  checkIfUserExists();

  web3.eth.isSyncing((error, sync) => {
    if (!error) {
      Session.set('syncing', sync !== false);

      // Stop all app activity
      if (sync === true) {
        // We use `true`, so it stops all filters, but not the web3.eth.syncing polling
        web3.reset(true);
        checkNetwork();
      // show sync info
      } else if (sync) {
        Session.set('startingBlock', sync.startingBlock);
        Session.set('currentBlock', sync.currentBlock);
        Session.set('highestBlock', sync.highestBlock);
      } else {
        Session.set('outOfSync', false);
      }
    }
  });

/*  Meteor.setInterval(checkNetwork, 2503);
  Meteor.setInterval(checkAccounts, 10657);
  Meteor.setInterval(checkIfUserExists, 10657)
});*/

Meteor.setInterval(checkNetwork, 2503);
Meteor.setInterval(checkAccounts, 10657);
Meteor.setInterval(checkIfUserExists, 112257)
});

Meteor.autorun(() => {
  console.log('KantumID started');

});
