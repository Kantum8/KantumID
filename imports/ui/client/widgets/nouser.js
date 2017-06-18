import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import eth from '/imports/utils/ethereumService';
import { $ } from 'meteor/jquery';

import './nouser.html';




Template.noUser.events({
  //"click #register": function(e) {
  "keyup #register": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    //var text = document.getElementById('username').innerText
    console.log(text);
    //var t = $(e.target.textContent)//.innerTexT()
    //var t = $(e.target.innerTexT)
    //console.log(t);
    changeName(text);
  }
});

/*
Template.noUser.events({
  "click #register": function(e) {
    var username = document.getElementById('username').innerText
    console.log(username);
    //var t = $(e.target.textContent)//.innerTexT()
    //var t = $(e.target.innerTexT)
    //console.log(t);
//    eth.registerUser(username);
  }
});

Template.noUser.events({
  'submit .register'(event) {
    // Prevent default browser form submit
  //  event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    console.log(text);
     Insert a task into the collection
    Tasks.insert({
      text,
      createdAt: new Date(), // current time
    });

    // Clear form
    //target.text.value = '';
  },
});
/*
Template.noUser.onRendered(() => {
  Session.set('rendered', true);
});
*/
