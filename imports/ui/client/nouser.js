import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Session } from 'meteor/session';
import places from 'places.js';
import eth from '/imports/utils/ethereumService';
import err from '/imports/utils/errorService';

import './nouser.html';

Template.noUser.onRendered(() => {
  Session.set('transactionSigned', false);
  var placesAutocomplete = places({
    container: document.querySelector('#address-input')
  });
  /**
 * Surely there's some improvements to make, comments/help always appreciated :3
 */

function init() {
  // Generate li foreach fieldset
  for (var i = 0; i < count; i++) {
    var ul = document.querySelector('ul.items'),
        li = document.createElement("li");

    ul.appendChild(li);
  }
  // Add class active on first li
  ul.firstChild.classList.add('active');
}

function next(target) {
  var input = target.previousElementSibling;
  // Check if input is empty
  if (input.value === '') {
    body.classList.add('error');
  } else {
    body.classList.remove('error');
    console.log(input.value);
    var enable = document.querySelector('form fieldset.enable'),
        nextEnable = enable.nextElementSibling;
    enable.classList.remove('enable');
    enable.classList.add('disable');
    nextEnable.classList.add('enable');

    // Switch active class on left list
    var active = document.querySelector('ul.items li.active'),
        nextActive = active.nextElementSibling;
    active.classList.remove('active');
    nextActive.classList.add('active');

    let firstName = $('input[name=firstName]').val();
    let lastName = $('input[name=lastName]').val();
    let dateOfBirth = $('input[name=dateOfBirth]').val();
    let placeOfBirth = $('input[name=placeOfBirth]').val();
    let userType = Session.get('userType')

    newUserInfo = {
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      palceOfBirth: placeOfBirth,
      userType: userType,
      id: `${firstName}${lastName}${dateOfBirth}${placeOfBirth}${userType}`
    }

    Session.set('newUserInfo', input.value);
  }
}

function keyDown(event) {
  var key = event.keyCode,
      target = document.querySelector('fieldset.enable .button');
  if (key == 13 || key == 9) next(target);
}

var body = document.querySelector('body'),
    form = document.querySelector('form'),
    count = form.querySelectorAll('fieldset').length;

window.onload = init;
document.body.onmouseup = function (event) {
    var target = event.target || event.toElement;
    if (target.classList.contains("userTypePatient")) {
      Session.set('userType', 'patient');
      next(target);
    } else if (target.classList.contains("userTypeHealthCareProvider")) {
      Session.set('userType', 'healthCareProvider');
      next(target);
    }
    if (target.classList.contains("button")) {
      next(target);
    }
};
document.addEventListener("keydown", keyDown, false);


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
