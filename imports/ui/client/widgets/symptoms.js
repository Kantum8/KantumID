import { Template } from 'meteor/templating';
//import { BigNumber } from 'meteor/ethereum:web3';
//import { Dapple, web3 } from 'meteor/makerotc:dapple';

//import { changeName, getName } from '/imports/api/contract';

import './symptoms.html';


Template.symptoms.viewmodel({
  symptoms(event) {
    // Prevent default browser form submit
    event.preventDefault();
    // Get value from form element
    const text = event.recipient;
    // Clear form
    event.recipient = '';

    // Send transaction
    //changeName(text)
  },
  //getName
});
