import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import _ from 'lodash';
import eth from '/imports/utils/ethereumService';
import crypto from '/imports/utils/cryptoService';
import * as cryptojs from "crypto-js";
import * as sha3 from 'solidity-sha3';
import mail from '/imports/utils/mailerService';


export const encryptAndProcessData = (data, username) => {
  eth.initialize(function(connected) {
    if(!connected) {
      console.log("Not connected to the Ethereum network.");
      return;
    } else {
      eth.getUsersPublicKey(username, function(error, result) {
        if(error) {
        console.log("User not found");
          return;
        } else {
          console.log(result);
          var saverIdentity= {
            publicKey: result.publicKey
          };
          encryptedData = crypto.encrypt(saverIdentity, JSON.stringify(data));
          let currentTime = new Date();
          let secureData = {
            toAddress: result.address,
            username: [],
            attachments: [],
            subject: 'Health',
            time: currentTime.toString(),
            data: encryptedData
          };
          mail.sendData(secureData)
        }
      });
    }
  });
}
/*
encryptAndProcessData('Je joue a la play avec des orang-outang de Madagascar', username)


// Recuperer le mail dans la blockchain
var Identity = {
  privateKey: Session.get('connexionSigned').privateKey
}
var username = Session.get('connexionSigned').username



var encryptedData = mail.startInboxListener(1880641, function(err, result){
  if (err) {
    //console.log('pip' + err);
  } else {
    //console.log('caca' + result);
    console.log(mailData.ipfsHash);
  }
});

//decryptedData = JSON.parse(crypto.decrypt(Identity, encryptedData));
//console.log('This is the decrypted data: ' + decryptedData);

export const decryptAndProcessEmail = (mail, privateKey) => {

}*/


import './medhistory.html';




Template.medhistory.viewmodel({
  autorun() {
    //getName()
    name = Session.get('name');
    illnessesHistory: [name];
    console.log(name);
  },
  illnessesHistory: [name],
  });

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['illnessesName', 'description'];

IllnessesSearch = new SearchSource('illnesses', fields, options);


Template.searchResult.helpers({
  getIllnesses: function() {
    return IllnessesSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      limit: 3,
      sort: {isoScore: -1}
    });
  },
});


Template.searchResult.events({
  "click #search-result": function(e) {
    var text = document.getElementById('search_result').innerText
    console.log(text);
    //var t = $(e.target.textContent)//.innerTexT()
    //var t = $(e.target.innerTexT)
    //console.log(t);
    changeName(text);
  }
});

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    IllnessesSearch.search(text);
  }, 200),
});
