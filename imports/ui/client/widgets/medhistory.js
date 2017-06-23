import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import _ from 'lodash';
import dataService from '/imports/utils/dataService';
import eth from '/imports/utils/ethereumService';
import crypto from '/imports/utils/cryptoService';
import * as cryptojs from "crypto-js";
import * as sha3 from 'solidity-sha3';

import './medhistory.html';

export const encryptAndProcessData = (subject, data, username) => {
  eth.initialize(connected => {
    if(!connected) {
      console.log("Not connected to the Ethereum network.");
      return;
    } else {
      eth.getUsersPublicKey(username, (error, result) => {
        if(error) {
        console.log("User not found");
          return;
        } else {
          console.log(result);
          const saverIdentity= {
            publicKey: result.publicKey
          };
          encryptedData = crypto.encrypt(saverIdentity, JSON.stringify(data));
          let currentTime = new Date();
          let secureData = {
            toAddress: result.address,
            username: result.username,
            attachments: [],
            subject,
            time: new Date(),
            id: result.address + Date.now(),
            data: encryptedData
          };
          dataService.sendData(secureData);
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



Template.medhistory.viewmodel({
  autorun() {
    if (typeof Session.get('data') === 'undefined') {
      name = 'Add a illnesses';
    } else {
      name = Session.get('data').data;
    }
    illnessesHistory: [name];
  },
  illnessesHistory: [name],
});

const options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
const fields = ['illnessesName', 'description'];

IllnessesSearch = new SearchSource('illnesses', fields, options);


Template.searchResult.helpers({
  getIllnesses() {
    return IllnessesSearch.getData({
      transform(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      },
      limit: 3,
      sort: {isoScore: -1}
    });
  },
});


Template.searchResult.events({
  "click #search-result": function(e) {
    const illnesses = document.getElementById('search_result').innerText;
    console.log(illnesses);
    const username = Session.get('connexionSigned').username;
    encryptAndProcessData('medhistory', illnesses, username);
  }
});

Template.searchBox.events({
  "keyup #search-box": _.throttle(({target}) => {
    const text = $(target).val().trim();
    IllnessesSearch.search(text);
  }, 200),
});
