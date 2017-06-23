import { Session } from 'meteor/session';
import { Blaze } from 'meteor/blaze';
import { Spacebars } from 'meteor/spacebars';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { moment } from 'meteor/momentjs:moment';


Template.registerHelper('contractExists', () => {
  const network = Session.get('network');
  const isConnected = Session.get('isConnected');
  const exists = Session.get('contractExists');
  const userFound = Session.get('userFound');
  return network !== false && isConnected === true && exists === true;
});

Template.registerHelper('network', () => Session.get('network'));
/*
Template.registerHelper('contractHref', () => {
  let contractHref = '';
  if (Dapple['maker-otc'].objects) {
    const network = Session.get('network');
    let networkPrefix = '';
    if (network === 'ropsten') {
      networkPrefix = 'testnet.';
    } else if (network === 'kovan') {
      networkPrefix = 'kovan.';
    }
    const contractAddress = Dapple['maker-otc'].environments[Dapple.env].otc.value;
    contractHref = `https://${networkPrefix}etherscan.io/address/${contractAddress}`;
  }
  return contractHref;
});
*/
Template.registerHelper('ready', () =>
  // XXX disabled 'syncing' as parity is being very bouncy
  // Session.get('isConnected') && !Session.get('syncing') && !Session.get('outOfSync')
  Session.get('isConnected') && !Session.get('outOfSync')
);

Template.registerHelper('isConnected', () => Session.get('isConnected'));

Template.registerHelper('hasAccount', () => Session.get('address'));

Template.registerHelper('userFound', () => Session.get('userFounded'));

Template.registerHelper('connexionSigned', () => Session.get('connexionSigned'))

Template.registerHelper('userNotFound', () => Session.get('userNotFound'));

Template.registerHelper('transactionSigned', () => Session.get('transactionSigned'));

Template.registerHelper('outOfSync', () => Session.get('outOfSync'));

Template.registerHelper('syncing', () => Session.get('syncing'));

Template.registerHelper('syncingPercentage', () => {
  const startingBlock = Session.get('startingBlock');
  const currentBlock = Session.get('currentBlock');
  const highestBlock = Session.get('highestBlock');
  return Math.round(100 * ((currentBlock - startingBlock) / (highestBlock - startingBlock)));
});

Template.registerHelper('loading', () => Session.get('loading'));

Template.registerHelper('loadingProgress', () => Session.get('loadingProgress'));

Template.registerHelper('address', () => Session.get('address'));

Template.registerHelper('ETHBalance', () => Session.get('ETHBalance'));

Template.registerHelper('equals', (a, b) => a === b);

Template.registerHelper('not', (b) => !b);

Template.registerHelper('or', (a, b) => a || b);

Template.registerHelper('and', (a, b) => a && b);

Template.registerHelper('and3', (a, b, c) => a && b && c)

Template.registerHelper('gt', (a, b) => a > b);

Template.registerHelper('concat', (...args) => Array.prototype.slice.call(args, 0, -1).join(''));

Template.registerHelper('timestampToString', (ts, inSeconds, short) => {
  let timestampStr = '';
  if (ts) {
    const momentFromTimestamp = (inSeconds === true) ? moment.unix(ts) : moment.unix(ts / 1000);
    if (short === true) {
      timestampStr = momentFromTimestamp.format('DD-MMM-HH:mm');
    } else {
      timestampStr = momentFromTimestamp.format();
    }
  }
  return timestampStr;
});

Template.registerHelper('log', (value) => {
  console.log(value);
});

Template.registerHelper('fromWei', (s) => web3.fromWei(s));

Template.registerHelper('toWei', (s) => web3.toWei(s));

Template.registerHelper('friendlyAddress', (address) => {
  /* eslint-disable no-underscore-dangle */
  if (address === Blaze._globalHelpers.contractAddress()) {
    return 'market';
  } else if (address === Blaze._globalHelpers.address()) {
    return 'me';
  }
  return `${address.substr(0, 9)}...`;
  /* eslint-enable no-underscore-dangle */
});

Template.registerHelper('loadingIcon', (size) => {
  const image = (size === 'large') ? 'loadingLarge' : 'loading';
  return `<img src="${image}.svg" alt="Loading..." />`;
});
