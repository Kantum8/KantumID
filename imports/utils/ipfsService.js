import ipfs from 'browser-ipfs';

/*
 * WORKING BUT NEED INFURA.IO IPFS NODE => Go to browser node with lib like libp2p-ipfs-browser
 */

ipfs.setProvider({ host: 'ipfs.infura.io', port: 5001, protocol: 'https', root: '/api/v0' });

const ipfsService = {
  store(data, callback) {
    ipfs.add(new Buffer(data), (err, hash) => {
      if (err) {
        throw err;
      } else {
        console.log(`Successfully stored on ipfs: ${hash}`);
        return callback(null, hash);
      }
    });
  },

  fetch(hash, callback) {
    ipfs.cat(hash, (err, res) => {
      if (err) {
        throw err;
      } else {
        console.log(`This the data stored on ipfs at: ${res}`);
        return callback(null, res, hash);
      }
    })
  }
};

export default ipfsService;
