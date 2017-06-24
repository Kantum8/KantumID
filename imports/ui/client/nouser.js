import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Session } from 'meteor/session';
import eth from '/imports/utils/ethereumService';

import './nouser.html';


Template.noUser.events({
  'submit .register'(event, instance) {
    /*validate: function validate(username){
      if (username.length === 0) {
        event.target.classList += " error";
        console.log(error);
        return;
      }
      event.target.classList = "auth-input";
    }*/
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const username = target.text.value;

    if (username == "") {
        alert("Name must be filled out");
        return false;
    } else {
      eth.registerUser(username, function(error, events) {
        if(events) {
          console.log(events);
        }
      });
      // Clear form
      target.text.value = '';

      transactionSigned: function transactionSigned() {
        console.log('transacctionSigned');
          return web3 &&
                web3.eth.getTransaction &&
                web3.eth.getTransaction.constructor.name === 'NewTransaction';
      }
      // Waiting indicator
      Session.set('transactionSigned', true)
    }
  },
});
