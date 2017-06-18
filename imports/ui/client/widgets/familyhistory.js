import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Session } from 'meteor/session';
//import { BigNumber } from 'meteor/ethereum:web3';
import { _ } from 'meteor/underscore';
import Chart from '/imports/utils/Chart.min';
import './familyhistory.html';




Template.familyhistory.viewmodel({

});

Template.familyhistory.onRendered(() => {
  Session.set('rendered', true);
});
