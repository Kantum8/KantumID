import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import eth from '/imports/utils/ethereumService';
import dataService from '/imports/utils/dataService';
import crypto from '/imports/utils/cryptoService';


// CHECK FOR NETWORK
function checkNetwork() {
  eth.initialize(connected => {
    if(typeof web3 !== 'undefined') {
      web3.version.getNode((error) => {
        const isConnected = !error;

        //Check if we are synced
        if (isConnected) {
          web3.eth.getBlock('latest', (e, {number, timestamp}) => {
            if (number >= Session.get('latestBlock')) {
              Session.set('outOfSync', e != null || (new Date().getTime() / 1000) - timestamp > 600);
              Session.set('latestBlock', number);
              if (Session.get('startBlock') === 0) {
                console.log(`Setting startblock to ${number - 6000}`);
                Session.set('startBlock', (number - 6000));
              }
            } else {
              // XXX MetaMask frequently returns old blocks
              // https://github.com/MetaMask/metamask-plugin/issues/504
              console.debug('Skipping old block');
            }
          });
        }

        // Check which network are we connected to
        // https://github.com/ethereum/meteor-dapp-wallet/blob/90ad8148d042ef7c28610115e97acfa6449442e3/app/client/lib/ethereum/walletInterface.js#L32-L46
        if (!Session.equals('isConnected', isConnected)) {
          if (isConnected === true) {
            web3.eth.getBlock(0, (e, {hash}) => {
              let network = false;
              if (!e) {
                switch (hash) {
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

// Check which accounts are available and if defaultAccount is still available,
// Otherwise set it to localStorage, Session, or first element in accounts
function checkAccounts() {
  if (typeof web3 !== 'undefined') {
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
}

// CHECK if user have a KantumID account
function checkIfUserExists(callback) {
  if (typeof Session.get('address') !== 'undefined') {
    eth.checkIfUserExists(function(err, result){
      if (err) {
        console.log(err);
      } else {
        if (typeof Session.get('userFound') !== 'undefined') {
          let userInfo = Session.get('userFound');
          if (typeof Session.get('gettingUserSign') === 'undefined' && typeof Session.get('connexionSigned') === 'undefined') {
            Session.set('gettingUserSign', true);
            eth.generateKeyPair(userInfo.username, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                const Identity = {
                  username: userInfo.username,
                  privateKey: result,
                  startingBlock: userInfo.startingBlock
                };
                return Session.set('connexionSigned', Identity);
              }
            });
          } else {
            console.log('Session is ever signed');
          }
        }
      }
    })
  }
}

// CHECK sved data
function checkData(callback) {
  if (typeof Session.get('connexionSigned') !== 'undefined') { // && typeof Session.get('data') === 'undefined') {
    console.log('je joue des maracas');
    dataService.startInboxListener(1880641, (err, data) => {
      if (err) {
        return Session.set('data', err);
      }
    });
  }
}

// Initialize everything on new network
function initNetwork(newNetwork) {
  checkAccounts();
  Session.set('network', newNetwork);
  Session.set('isConnected', true);
  Session.set('latestBlock', 0);
  Session.set('startBlock', 0);
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


/*

import db from '/imports/utils/dbService';


data = 'caca'

db.saveData(data, function(err, result){
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});


db.fetchData(data, function(err, result){
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
})
*/








/**
 * Startup code
 */
Meteor.startup(() => {
  initSession();
  checkNetwork();
  checkIfUserExists();
  checkData();

if(typeof web3 !== 'undefined') {
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
}


Meteor.setInterval(checkNetwork, 2503);
Meteor.setInterval(checkAccounts, 10657);
Meteor.setInterval(checkIfUserExists, 11657)
Meteor.setInterval(checkData, 11200)
});

Meteor.autorun(() => {
  console.log('KantumID started');

});
