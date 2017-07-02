import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Session } from 'meteor/session';
import eth from '/imports/utils/ethereumService';
import err from '/imports/utils/errorService';

import './nouser.html';

Template.noUser.onRendered(() => {
  return Session.set('transactionSigned', false);
});

Template.noUser.events({
  'click .close'(event, instance) {
    return Session.set('error', false)
  },
  'submit .register'(event, instance) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const target = event.target;
    const username = target.text.value;

    if (username.length === 0) {
      $('.message-error').addClass('active');
        setTimeout(function(){
          $('.btn').removeClass('loading');
        }, 500);

      function closeMessage() {
        $('.message-error').removeClass('active');
      }

      $('.close').click(closeMessage);

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
