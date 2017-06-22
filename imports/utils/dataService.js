import ipfs from './ipfsService';
import eth from './ethereumService';
import crypto from './cryptoService';
import sha3 from 'solidity-sha3';

const backupIpfsNodes = ['https://earth.i.ipfs.io/ipfs/', 'https://ipfs.io/ipfs/', 'https://ipfs.infura.io:5001/api/v0/cat/' ];

const dataService = {
  sendData(data, callback) {
    ipfs.store(JSON.stringify(data), (error, ipfsHash) => {
      eth.writeData(data.toAddress, ipfsHash, data.inReplyTo, (error, result) => {
        //Request newly stored data from bootstrap IPFS nodes
        for(let i = 0; i < backupIpfsNodes.length; i++) {
          makeHttpRequest(backupIpfsNodes[i] + ipfsHash);
        }
        return callback(error, result);
      });
    });
  },
  startInboxListener(startingBlock, callback) {
    console.log("Starting inbox listener");

    eth.watchForIncomingData(startingBlock, ({args, transactionHash}) => {
      const isReply = args.inReplyToIpfsHash != 'null';

      const ipfsHash = isReply ? args.inReplyToIpfsHash : args.ipfsHash;
      ipfs.fetch(ipfsHash, (err, content, hash) => {
        if (err) {
          console.log(err);
        } else {
        const data = JSON.parse(content);
        const Identity = {
          privateKey: Session.get('connexionSigned').privateKey
        };


        var decryptedData = JSON.parse(crypto.decrypt(Identity, data.data));
        console.log(`This is the decrypted data: ${decryptedData}`);

/*
        if (new Mongo.Collection('jeanmould') !== null) {
          console.log('Todos alrady exists');
        } else {
        //  const Todos = new Mongo.Collection('jeanmould');
        }


        function dump(obj) {
          var out = '';
          for (var i in obj) {
            out += i + obj[i];
          }
/*
          Todos.insert({_id: out});
          // And this line is querying it
          const todo = Todos.findOne({_id: out});
          // So this happens right away!
          console.log(todo);
*
        }

        dump(decryptedData);

        /*
        for (var i = 0; i < decryptedData.length; i++) {
          var jeanmould = jeanmould + decryptedData;
          console.log(jeanmould);
          //return Session.set('jeanmould', jeanmould);
        }*/

        data.data = decryptedData
        console.log(data.data);
        data.fromAddress = args.from;
        data.ipfsHash = hash;
        data.transactionHash = transactionHash;
        data.isReply = args.inReplyToIpfsHash != 'null';
        data.inReplyTo = args.inReplyToIpfsHash;

        return callback(data);
      }
      });
    });
  }
};

function makeHttpRequest(url) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

export default dataService;
