import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Session } from 'meteor/session';
import eth from '/imports/utils/ethereumService';

import './nouser.html';


Template.noUser.events({
  validate(e){
    if (e.target.value.length === 0) {
      e.target.classList += " error";
      return;
    }
    e.target.classList = "auth-input";
  },


  'submit .register'(event, instance) {
    instance.counter.set(instance.counter.get() + 1);
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const username = target.text.value;
    console.log(username);


  //validate(username);
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

  },
});
