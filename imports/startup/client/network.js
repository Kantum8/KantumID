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
var request = require('request')

var Purest = require('purest')
var fitbit = new Purest({provider:'fitbit',
  key:'228KHB', secret:'f905c6313d7c50fe716164f2468c379d'})

fitbit.get('user/-/profile', {
  oauth:{token:'fitbit.token', secret:'fitbit.secret'}
}, function (err, res, body) {})
d blaze

/*
var express = require("express"),
    app = express();

// initialize the Fitbit API client
var FitbitApiClient = require("fitbit-node"),
    client = new FitbitApiClient("YOUR_CLIENT_ID", "YOUR_CLIENT_SECRET");

// redirect the user to the Fitbit authorization page
app.get("/authorize", function (req, res) {
    // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition profile settings sleep social weight', 'YOUR_CALLBACK_URL'));
});

// handle the callback from the Fitbit authorization flow
app.get("/callback", function (req, res) {
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'YOUR_CALLBACK_URL').then(function (result) {
        // use the access token to fetch the user's profile information
        client.get("/profile.json", result.access_token).then(function (results) {
            res.send(results[0]);
        });
    }).catch(function (error) {
        res.send(error);
    });
});

// launch the server
app.listen(3000);

ServiceConfiguration.configurations.remove({
    service: "fitbit"
  });

ServiceConfiguration.configurations.upsert(
  { service: "fitbit" },
  { $set: { consumerKey: "228KHB", secret: "f905c6313d7c50fe716164f2468c379d"} }
);

/*
Fitbit = {};

// Request LinkedIn credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Fitbit.requestCredential = function (options, credentialRequestCompleteCallback) {
  console.log('🔑', 'Fitbit.requestCredential');
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  const config = ServiceConfiguration.configurations.findOne({service: 'fitbit'});
  console.log('🔑 config', config);
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
    console.log('🔑', 'returning no config');
    return;
  }

  const credentialToken = Random.secret();

  let scope = [];
  if (options && options.requestPermissions) {
      scope = options.requestPermissions.join('+');
  }

  const loginStyle = OAuth._loginStyle('fitbit', config, options);

  const loginUrl =
        'https://www.fitbit.com/oauth2/authorize' +
        '?response_type=code' + '&client_id=' + config.clientId +
        '&redirect_uri=' + OAuth._redirectUri'fitbit', config) +
        '&scope=' + scope +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);

  OAuth.launchLogin({
    loginService: "fitbit",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};
*/








/*

var FitbitClient = require('fitbit-client-oauth2');
var client = new FitbitClient(228KHB, f905c6313d7c50fe716164f2468c379d);
var redirect_uri = 'https://9d79e3a3.ngrok.io';
var scope =  [ 'activity', 'nutrition', 'profile', 'settings', 'sleep', 'social', 'weight' ];

    // server.get
    HTTP.get('/auth/fitbit', function(req, res, next) {

        var authorization_uri = client.getAuthorizationUrl(redirect_uri, scope);

        res.redirect(authorization_uri);
    });

    // If /auth/fitbit/callbac is your redirec_uri

    server.get('/auth/fitbit/callback', function(req, res, next) {

        var code = req.query.code;

        client.getToken(code, redirect_uri)
            .then(function(token) {

                // ... save your token on db or session...
                console.log(token + 'this ');
                // then redirect
                //res.redirect(302, '/user');

            })
            .catch(function(err) {
                // something went wrong.
                res.send(500, err);

            });

    });




/**
 * Server functionality (boilerplate).
 * Ensures sanity of published user object.
 *
} else {
  Accounts.addAutopublishFields({
    forLoggedInUser: _.map(
      /**
       * Logged in user gets whitelisted fields + accessToken + expiresAt.
       *

    Fitbit.whitelistedFields.concat(['accessToken', 'expiresAt']), // don't publish refresh token
      function(subfield) {
        return 'services.fitbit.' + subfield;
      }),

    forOtherUsers: _.map(
      /**
       * Other users get whitelisted fields without emails, because even with
       * autopublish, no legitimate web app should be publishing all users' emails.
       *
      _.without(Fitbit.whitelistedFields, 'email', 'verified_email'),
      function(subfield) {
        return 'services.fitbit.' + subfield;
      })
  });
}
/*

import passport from 'passport';

User = new Mongo.Collection('user');

var FitbitStrategy = require('passport-fitbit-oauth2').FitbitOAuth2Strategy;

passport.use(new FitbitStrategy({
    clientID:     "228KHB",
    clientSecret: "f905c6313d7c50fe716164f2468c379d",
    callbackURL: "https://kantumid.eu.meteorapp.com/"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    User.findOrCreate({ fitbitId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.authenticate('fitbit', { scope: ['activity','heartrate','location','profile'] });



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
