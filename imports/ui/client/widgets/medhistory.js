import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import _ from 'lodash';
import dataService from '/imports/utils/dataService';
import eth from '/imports/utils/ethereumService';
import crypto from '/imports/utils/cryptoService';
import * as cryptojs from "crypto-js";
import * as sha3 from 'solidity-sha3';

import './medhistory.html';

export const encryptAndProcessData = (subject, data, username, callback) => {
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
          const saverIdentity= {
            publicKey: result.publicKey
          };
          encryptedData = crypto.encrypt(saverIdentity, JSON.stringify(data));
          console.log(encryptedData);
          let currentTime = new Date();
          let secureData = {
            toAddress: result.address,
            username: Session.get('connexionSigned').username,
            attachments: [],
            subject: subject,
            time: new Date(),
            id: result.address + Date.now(),
            data: encryptedData
          };
          console.log(secureData);
          dataService.sendData(secureData, function(err, result){
            if (err) {
              console.log(err);
            } else {
              return callback(secureData);
            }
          });
        }
      });
    }
  });
}

const options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
const fields = ['illnessesName', 'description'];
IllnessesSearch = new SearchSource('illnesses', fields, options);


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

Template.searchResult.onRendered(() => {
  return Session.set('modaL', false);
  // generate date her
})

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
  getPlaceholderDate() {
    let fromDate = 1// moment().subtract(5, 'days').calendar();
    let toDate = moment().format('L');
    date =
    {
      fromDate: moment().subtract(5, 'days').calendar(),
      toDate: moment().format('L')
    }
    //return [fromDate, toDate]
  /*  return date = {
        fromDate: fromDate,
        toDate: toDate
    };
    console.log(date.fromDate);
    //console.log(date);
    //return date;*/
  }
});


Template.searchResult.events({
  "click .closer": function(e) {
    return Session.set('modaL', false)

  },

  "click #search-result": function(e) {
    return Session.set('modaL', true)
  },

  "click .btn-add-med": function(e) {
    var $btn = $('.btn-add-med');
    let illnesses = $('#search_result').text();
    let dateFrom = $('input[type=text][name=arrival]').val();
    let dateTo = $('input[type=text][name=departure]').val();

    if(illnesses.length === 0) {
      alert('Enter a illnesses');
    } else if(dateFrom.length === 0) {
      alert('Enter the date of beginning of you illnesses');
    } else if(dateTo.length === 0) {
      alert('Enter the date of end of you illnesses');
    } else if (illnesses.length !== 0 && dateFrom.length !== 0 && dateTo.length !== 0) {
      illnesses =
        {
          "illnesses": illnesses,
          "dateOfIllnesses":
          {
            "from": dateFrom,
            "to": dateTo
          }
        }
      console.log(illnesses);
      const username = Session.get('connexionSigned').username;

      encryptAndProcessData('medhistory', illnesses, username, function(err, result){
        if(err){
          console.log(err)
          console.log('bad');
        } else {
          console.log('cool');
          $btn.toggleClass('booked');
          $('.diamond').toggleClass('windup');
          $('form').slideToggle(300);
          $('.linkbox').toggle(200);
          if ($btn.text() === "ADD NOW") {
            $btn.text("ADDED!");
          } else {
            $btn.text("ADD NOW");
          }
        }
      });
    }
  }
});

Template.searchBox.events({
  "keyup #search-box": _.throttle(({target}) => {
    const text = $(target).val().trim();
    IllnessesSearch.search(text);
  }, 200),
});
