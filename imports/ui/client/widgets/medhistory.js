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
          mail.sendEmail(secureData)
        }
      });
    }
  });
}
/*
var Identity = {
  privateKey: "9ecb9dc04a0fe577fef42848544eb615927eb617d6a7f90fb7b563254cb25311"
};
*/
var Identity = {
  privateKey: Session.get('connexionSigned').privateKey
}
console.log(Identity);
var privateKey = "9ecb9dc04a0fe577fef42848544eb615927eb617d6a7f90fb7b563254cb25311" // Session.get('connexionSigned').privateKey
var username = "h@lemonmail.eth                 "
//encryptAndProcessData('je mange de la choucroute', username)

//var encryptedData = "033822ce369b2d504c2dac16216cb6c103f42289da21608aa1369a7bcfc53f9be0e21b41628c42a149b13e91dee954978e0483e1cc8ba2225f7dd39c327adaee2bc2e8eedfc97aef0149d2038c803b2dd1f7e7551a4581ee41f8eaa39c4504854826cfca27fb5d58e5efdca51ae4fccec3"
var encryptedData = "03d5da589df524882781c0bd334d06c724559efa6d42793f2a86ac14ed093c85ccd0b4e07c50f1d3ebd3457d5e783b113a852d4b3b5bc3637a0ed7853ae085392a3813eff77081d56632eacd77d1af488a56f4f9f6a7cf22a0a9000f8fe24b7ecc7e8c5a265e1adf7326bc4e43f159ffef"


decryptedData = JSON.parse(crypto.decrypt(Identity, encryptedData));

console.log('This is the decrypted data: ' + decryptedData);

/*
mail.startInboxListener(1880641, function(err, result){
  console.log('je joue a la play');
  /*if (err) {
    console.log('pip' + err);
  } else {
    console.log('caca' + result);
  }*
});
*/
export const decryptAndProcessEmail = (mail, privateKey) => {

}


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
