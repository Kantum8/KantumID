import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import dataService from '/imports/utils/dataService';
import eth from '/imports/utils/ethereumService';
import crypto from '/imports/utils/cryptoService';
import db from '/imports/utils/dbService';

import './profileinformations.html';

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


Template.profileinformations.helpers({
  getProfileInformations() {
    var profileInformations = []
    db.fetchData('profileInformations', (err, result) => {
      i = result.length - 1;
      if (i >= 0) {
        profileInformations = result[i].data.data;
        return profileInformations;
      }
    });
    return profileInformations;
  },
})


Template.profileinformations.events({
  "submit form": function(e) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    let email = $('input[type=email]').val();
    if (email.length === 0) {
      email = $('input[type=email]').attr('placeholder');
    }
    let firstName = $('input[name=firstName]').val();
    if (firstName.length === 0) {
      firstName = $('input[name=firstName]').attr('placeholder');
    }
    let lastName =  $('input[name=lastName]').val();
    if (lastName.length === 0) {
      lastName = $('input[name=lastName]').attr('placeholder');
    }
    let numberPhone = $('input[type=tel]').val();
    if (numberPhone.length === 0) {
      numberPhone = $('input[type=tel]').attr('placeholder');
    }
    let gender = $("input[name=selector]:checked").val();
    if (gender === undefined) {
      gender = $('input[name=selector]:checked').attr('placeholder');
    }
    let postalAddress = $('input[name=postalAddress]').val();
    if (postalAddress.length === 0) {
      postalAddress = $('input[name=postalAddress]').attr('placeholder');
    }
    let city = $('input[name=city]').val();
    if (city.length === 0) {
      city = $('input[name=city]').attr('placeholder');
    }
    let state = $('input[name=state]').val();
    if (state.length === 0) {
      state = $('input[name=state]').attr('placeholder');
    }
    let zipcode = $('input[name=zipcode]').val();
    if (zipcode.length === 0) {
      zipcode = $('input[name=zipcode]').attr('placeholder');
    }
    let birthday = $('input[name=birthday]').val();
    if (birthday.length === 0) {
      birthday = $('input[name=birthday]').attr('placeholder');
    }
    let socialSecurityNumber = $('input[name=socialSecurityNumber]').val();
    if (socialSecurityNumber.length === 0) {
      socialSecurityNumber = $('input[name=socialSecurityNumber]').attr('placeholder');
    }

    profileInformations = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      numberPhone: numberPhone,
      gender: gender,
      postalAddress: postalAddress,
      city: city,
      state: state,
      zipcode: zipcode,
      birthday: birthday,
      socialSecurityNumber: socialSecurityNumber
    }

    const username = Session.get('connexionSigned').username;

    encryptAndProcessData('profileInformations', profileInformations, username, function(err, result){
      if(err){
        console.log(err);
      } else {
        console.log(result);
      }
    });
  }
});
