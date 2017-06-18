import { Template } from 'meteor/templating';

import './noaccount.html';

Template.noAccount.helpers({
  metamask: function metamask() {
      return web3 &&
            web3.currentProvider &&
            web3.currentProvider.constructor.name === 'MetamaskInpageProvider';
  },
});
