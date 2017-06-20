import ipfs from './ipfsService';
import eth from './ethereumService';
import crypto from './cryptoService';
import sha3 from 'solidity-sha3';

var backupIpfsNodes = ['https://earth.i.ipfs.io/ipfs/', 'https://ipfs.io/ipfs/', 'https://ipfs.infura.io:5001/api/v0/cat/' ];

var mailerService = {
  sendData: function(emailData, callback) {
    ipfs.store(JSON.stringify(emailData), function(error, ipfsHash) {
      eth.writeEmail(emailData.toAddress, ipfsHash, emailData.inReplyTo, function(error, result) {
        //Request newly stored data from bootstrap IPFS nodes
        for(var i = 0; i < backupIpfsNodes.length; i++) {
          makeHttpRequest(backupIpfsNodes[i] + ipfsHash);
        }
        callback(error, result);
      });
    });
  },

  fetchSingleEmailThread: function(ipfsHash, startingBlock, callback) {
    ipfs.fetch(ipfsHash, function(error, content, ipfsHash) {
      var response = { emails: [JSON.parse(content)] };

      var originalReceiverAddress = response.emails[0].toAddress;

      eth.getEmailReplies(sha3.default(ipfsHash), originalReceiverAddress, startingBlock, function (replies) {
        if (replies.length == 0) {
          callback(null, response);
          return;
        }

        var ipfsToEthereumHash = [];

        for (var i = 0; i < replies.length; i++) {
          ipfsToEthereumHash[replies[i].ipfsHash] = replies[i].transactionHash;

          ipfs.fetch(replies[i].ipfsHash, function (error, content, hash) {
            var replyEmail = JSON.parse(content);
            replyEmail.ipfsHash = hash;
            replyEmail.transactionHash = ipfsToEthereumHash[hash];

            response.emails.push(replyEmail);

            if (response.emails.length == replies.length + 1) {
              callback(null, response);
            }
          });
        }
      })
    });
  },
  startInboxListener: function(startingBlock, callback) {
    console.log("Starting inbox listener");

    eth.watchForIncomingEmails(startingBlock, function(event) {
      var isReply = event.args.inReplyToIpfsHash != 'null';

      var ipfsHash = isReply ? event.args.inReplyToIpfsHash : event.args.ipfsHash;
      ipfs.fetch(ipfsHash, function (err, content, hash) {
        if (err) {
          console.log(err);
        } else {
        var data = JSON.parse(content);
        data.data = data.data;
        console.log(data.data);

        var Identity = {
          privateKey: Session.get('connexionSigned').privateKey
        }


        decryptedData = JSON.parse(crypto.decrypt(Identity, data.data));
        console.log('This is the decrypted data: ' + decryptedData);


        data.fromAddress = event.args.from;
        data.ipfsHash = hash;
        data.transactionHash = event.transactionHash;
        data.isReply = event.args.inReplyToIpfsHash != 'null';
        data.inReplyTo = event.args.inReplyToIpfsHash;

        callback(data);
      }
      });
    });
  }
};

function makeHttpRequest(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

module.exports = mailerService;
//export { mailerService };
