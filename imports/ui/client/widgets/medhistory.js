import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import _ from 'lodash';
import mail from '/imports/utils/mailerService';
import eth from '/imports/utils/ethereumService';
import crypto from '/imports/utils/cryptoService';
import * as cryptojs from "crypto-js";
import * as sha3 from 'solidity-sha3';



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
            username: result.username,
            attachments: [],
            subject: 'Health',
            time: new Date(),
            id: result.address + Date.now(),
            data: encryptedData
          };
          mail.sendData(secureData);
        }
      });
    }
  });
}

/*
var username = Session.get('connexionSigned').username;
var username = 'mokhtar';
encryptAndProcessData('Je joue a la play avec des orang-outang de Madagascar', username)
*/





export const decryptAndProcessEmail = (mail, privateKey) => {

}


import './medhistory.html';




Template.medhistory.viewmodel({
  autorun() {
    //getName()
    return name = Session.get('data');
  /*  while (typeof Session.get('data') === 'undefined') {
      name = Session.get('data');
      illnessesHistory: [name];
      console.log(name);
    }*/
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
