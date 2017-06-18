import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
//import { BigNumber } from 'meteor/ethereum:web3';
//import { Dapple, web3 } from 'meteor/makerotc:dapple';

//import { changeName, getName } from '/imports/api/contract';

import './profileinformations.html';


Template.profileinformations.viewmodel({
  updateinfo(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const text = event.recipient;
    // Clear form
    event.recipient = '';
    console.log(text);
    // Send transaction
    //changeName(text)
  },
  //getName
});
