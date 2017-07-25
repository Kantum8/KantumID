import eth from '/imports/utils/ethereumService';
import shh from '/imports/utils/whisperService';


const chatServices = {

  connectWithOtherUser(userId, topic, payload) {
    eth.checkIfUserExists(userId, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        // call whisperService when V5 in web3.js api will be available
        shh.sendMessage(userId, topic, payload)
      }
    })
  },

  sendMessage(userId, message) {

  },

  // transfer this function in network.js and integrate it in a infinite loop check new message every 5s
  receiveMessage(userId) {

  },


  botApi() {

  }

}
