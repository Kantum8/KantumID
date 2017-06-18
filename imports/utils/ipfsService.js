import ipfs from 'browser-ipfs';

/*
 * WORKING BUT NEED INFURA.IO IPFS NODE => Go to browser node with lib like libp2p-ipfs-browser
 */

ipfs.setProvider({ host: 'ipfs.infura.io', port: 5001, protocol: 'https', root: '/api/v0' });

var ipfsService = {
  store: function(data, callback) {
    ipfs.add(new Buffer(data), function(err, hash) {
      if (err) {
        throw err;
      } else {
        console.log('Successfully stored on ipfs: ' + hash);
        return callback(null, hash);
      }
    });
  },

  fetch: function(hash, callback) {
    ipfs.cat(hash, function(err, text) {
      if (err) {
        throw err;
      } else {
        console.log('This the data stored on ipfs at: ' + text);
        return text;
      }
    })
  }
}

/*
 *
 */

module.exports = ipfsService;
//export { ipfsService };










//import concat from 'concat-stream';
//import decoder from 'text-encoding';
//import Ipfs from 'ipfs';
/*import IPFSRepo from 'ipfs-repo';
/*
var bootstrapWsAddr = '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd';
var ipfsNode = null;


//var ipfs = new IpfsApi('localhost', '5001')

const repoPath = String(Math.random());

//ipfsNode = new IPFS()
ipfsNode = new Ipfs({
  repo: repoPath,
  init: false,
  start: false,
  EXPERIMENTAL: {
    pubsub: false
  }
});

/*
const repo = new IPFSRepo('/tmp/ipfs-repo');

repo.init({ cool: 'config' }, (err) => {
  if (err) {
    throw err;
  }

  repo.open((err) => {
    if (err) {
      throw err;
    }

    console.log('repo is ready');
  })
})

const repo = new IPFSRepo('/tmp/ipfs-repo');
const node = new IPFS({
  repo: repo,
  init: true, // default
  // init: false,
  // init: {
  //   bits: 1024 // size of the RSA key generated
  // },
  start: true,
  // start: false,
  EXPERIMENTAL: { // enable experimental features
    pubsub: true,
    sharding: true, // enable dir sharding
    wrtcLinuxWindows: true, // use unstable wrtc module on Linux or Windows with Node.js,
    dht: true // enable KadDHT, currently not interopable with go-ipfs
  },
  config: { // overload the default config
    Addresses: {
      Swarm: [
        '/ip4/127.0.0.1/tcp/1337'
      ]
    }
  }
})
/*
var ipfsService = {





  safeInit: function(callback) {
    if(ipfsNode !== null) {
      if(ipfsNode.isOnline()) {
        return callback();
      } else {
        ipfsNode.on('start', function() {
          callback();
        });
        return;
      }
    }

    const repoPath = String(Math.random());

    //ipfsNode = new IPFS()
    ipfsNode = new IPFS({
      repo: repoPath,
      init: false,
      start: false,
      EXPERIMENTAL: {
        pubsub: false
      }
    });

    window.ipfs = ipfsNode;

    ipfsNode.init({emptyRepo: true, bits: 2048}, function (err) {
      if (err) {
        throw err
      }

      ipfsNode.start(function (err) {
        if (err) {
          console.log("Error while staring IPFS node: " + err)
          return;
        }

        console.log('IPFS node is ready');

        // http://earth.i.ipfs.io/ipfs/
        ipfs.swarm.connect(bootstrapWsAddr, function (error, result) {
          ipfsNode.swarm.peers({}, function (error, result) {
            callback(error, result);
          });
        });
      })
    });
  },
  store: function(data, callback) {
    this.safeInit(function() {
      ipfs.swarm.connect(bootstrapWsAddr, function (error, result) {
        ipfsNode.files.add(new Buffer(data), function (err, res) {
          if (err || !res) {
            return callback('ipfs add error ' + err, null);
          }

          res.forEach(function (file) {
            if (file && file.hash) {
              console.log("Stored email at " + file.hash);
              return callback(null, file.hash);
            }
          })
        });
      });
    });
  },
  fetch: function(hash, callback) {
    this.safeInit(function() {
      console.log("Trying to fetch " + hash);

      ipfsNode.files.cat(hash, function (err, res) {
        if (err || !res) {
          return console.log('ipfs cat error', err, res)
        }

        res.pipe(concat(function (data) {
          console.log("Done fetching " + hash);
          return callback(null, new TextDecoder("utf-8").decode(data), hash);
        }))
      });
    });
  }
};


export { ipfsService };*
const IPFS = require('ipfs');

const repoPath = 'ipfs-' + Math.random();

const node = new IPFS({
  init: false,
  start: false,
  repo: repoPath
});


node.on('ready', () => {
  // Your now is ready to use \o/
  console.log('I\'m ready');
  // stopping a node
  node.stop(() => {
    // node is now 'offline'
  })
})
//const Node = new IPFS()*

import Ipfs from 'libp2p-ipfs-browser';
//import Ipfs from 'ipfs';





const concat = require('concat-stream'),
  decoder = require('text-encoding');
  Buffer = require('buffer/').Buffer

var bootstrapWsAddr = '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd';
var ipfsNode = null;

//var ipfsService = {
  //safeInit: function(callback) {
  //safeInit(callback => {
  function safeInit(callback) {
  //safeInit((callback) => {
    if(ipfsNode !== null) {
      if((cb) => ipfsNode.isOnline()) {
        return callback();
      } else {
        ipfsNode.on('start', function() {
          callback();
        });
        return;
      }
    }

    const repoPath = String(Math.random());

    ipfsNode = new Ipfs({
      repo: repoPath,
      init: false,
      start: false,
      EXPERIMENTAL: {
        pubsub: false
      }
    });

    window.ipfs = ipfsNode;

    (cb) => ipfsNode.init({emptyRepo: true, bits: 2048}, function (err) {
      if (err) {
        throw err
      }

      ipfsNode.start(function (err) {
        if (err) {
          console.log("Error while staring IPFS node: " + err)
          return;
        }

        console.log('IPFS node is ready');

        // http://earth.i.ipfs.io/ipfs/
        ipfs.swarm.connect(bootstrapWsAddr, function (error, result) {
          ipfsNode.swarm.peers({}, function (error, result) {
            callback(error, result);
          });
        });
      })
    });
  }

  function store(data, callback) {
  //store: function(data, callback) {
    (cb) => this.safeInit(function() {
      ipfs.swarm.connect(bootstrapWsAddr, function (error, result) {
        ipfsNode.files.add(new Buffer(data), function (err, res) {
          if (err || !res) {
            return callback('ipfs add error ' + err, null);
          }

          res.forEach(function (file) {
            if (file && file.hash) {
              console.log("Stored email at " + file.hash);
              return callback(null, file.hash);
            }
          })
        });
      });
    });
  }

//safeInit(function(error, event){
  //console.log(error);
//})

store('caca', function(error, result){
  if(!events){
    console.log(error);
  } else {
    console.log(result);
  }
})
export { safeInit }
  /*
  store: function(data, callback) {
    this.safeInit(function() {
      ipfs.swarm.connect(bootstrapWsAddr, function (error, result) {
        ipfsNode.files.add(new Buffer(data), function (err, res) {
          if (err || !res) {
            return callback('ipfs add error ' + err, null);
          }

          res.forEach(function (file) {
            if (file && file.hash) {
              console.log("Stored email at " + file.hash);
              return callback(null, file.hash);
            }
          })
        });
      });
    });
  },
  fetch: function(hash, callback) {
    this.safeInit(function() {
      console.log("Trying to fetch " + hash);

      ipfsNode.files.cat(hash, function (err, res) {
        if (err || !res) {
          return console.log('ipfs cat error', err, res)
        }

        res.pipe(concat(function (data) {
          console.log("Done fetching " + hash);
          return callback(null, new TextDecoder("utf-8").decode(data), hash);
        }))
      });
    });
  }
//};

//export { ipfsService };*

const Ipfs = require('libp2p-ipfs-browser');
Buffer = require('buffer/').Buffer

console.log('bpnjpur');
const ipfs = new Ipfs({
  init: true,
  start: true,
  repo: 'ipfs-testing',
  config: {
    Bootstrap: [
      "/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
      "/dns4/sfo-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx",
      "/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
      "/dns4/sfo-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
      "/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
      "/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
      "/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
      "/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64"
    ]
  }
})

const o = document.getElementById('out')
const s = document.getElementById('status')

ipfs.on('ready', () => {
  console.log('ipfs is ready');
  // API docs: https://github.com/ipfs/interface-ipfs-core/blob/master/README.md#api
  s.innerHTML = `Node status: ${ipfs.isOnline() ? 'online' : 'offline'}`
  o.innerHTML = `API: ${Object.keys(ipfs).filter(a => a[0] != '_').join(' | ')}\n\n`

  ipfs.id().then(i => o.innerHTML += JSON.stringify(i, null, 2) + '\n\n')

  ipfs.swarm.peers()
    .then(a => console.log(a))

  ipfs.files.add(new ipfs.types.Buffer(`Hello world! - ${Math.random().toString(36).slice(-8)}`))
    .then(i => i.pop().hash)
    .then(hash => {
      o.innerHTML += `You can find my randomly generated file <a target="_new" href="https://gateway.ipfs.io/ipfs/${hash}">here</a>!\n\n`
      return ipfs.files.cat(hash)
    })
    .then(s => {
      s.on('data', c => {
        console.log(c.toString())
        const i = c.toString()
        o.innerHTML += `It has these contents:\n${i}`
      })
    })
})

ipfs.files.add('hello world');
export { ipfsService };
*

'use strict';

const concat = require('concat-stream'),
  decoder = require('text-encoding');
  //Buffer = require('buffer/').Buffer;
  //Ipfs = require('libp2p-ipfs-browser');
import Ipfs from 'libp2p-ipfs-browser';

var bootstrapWsAddr = '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd';
var ipfsNode = null;

var ipfsService = {
  safeInit: function(callback) {
    if(ipfsNode !== null) {
      if(ipfsNode.isOnline()) {
        return callback();
      } else {
        ipfsNode.on('start', function() {
          callback();
        });
        return;
      }
    }

    const repoPath = String(Math.random());

    ipfsNode = new Ipfs({
      repo: repoPath,
      init: false,
      start: false,
      EXPERIMENTAL: {
        pubsub: false
      }
    });

    ipfs = ipfsNode;

    ipfsNode.init({emptyRepo: true, bits: 2048}, function (err) {
      if (err) {
        throw err
      }

      ipfsNode.start(function (err) {
        if (err) {
          console.log("Error while staring IPFS node: " + err)
          return;
        }

        console.log('IPFS node is ready');

        // http://earth.i.ipfs.io/ipfs/
        ipfs.swarm.connect(bootstrapWsAddr, function (error, result) {
          ipfsNode.swarm.peers({}, function (error, result) {
            callback(error, result);
          });
        });
      })
    });
  },
  store: function(data, callback) {
    //this.safeInit(function() {
      ipfs.swarm.connect(bootstrapWsAddr, function (error, result) {
        ipfsNode.files.add(new Buffer(data), function (err, res) {
          if (err || !res) {
            return callback('ipfs add error ' + err, null);
          }

          res.forEach(function (file) {
            if (file && file.hash) {
              console.log("Stored email at " + file.hash);
              return callback(null, file.hash);
            }
          })
        });
      });
    //});
  },
  fetch: function(hash, callback) {
    this.safeInit(function() {
      console.log("Trying to fetch " + hash);

      ipfsNode.files.cat(hash, function (err, res) {
        if (err || !res) {
          return console.log('ipfs cat error', err, res)
        }

        res.pipe(concat(function (data) {
          console.log("Done fetching " + hash);
          return callback(null, new TextDecoder("utf-8").decode(data), hash);
        }))
      });
    });
  }
};
/*
ipfsService.store('caca', function(error, result){
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
})*

const repoPath = 'ipfs-' + Math.random()

// Create an IPFS node
const cnode = new Ipfs({
  init: false,
  start: false,
  repo: repoPath
})

// Init the node
cnode.init(handleInit)

function handleInit (err) {
  if (err) {
    throw err
  }

  node.start(() => {
    console.log('Online status: ', node.isOnline() ? 'online' : 'offline')



    // You can write more code here to use it. Use methods like
    // node.files.add, node.files.get. See the API docs here:
    // https://github.com/ipfs/interface-ipfs-core/tree/master/API
  })
}

module.exports = ipfsService;*/



/*

const repopath = 'ipfs-' + Math.random()

    // Create an IPFS node
    const node = new Ipfs({
      init: false,
      start: false,
      repo: repopath
    })

    // Init the node
    node.init(handleInit)

    function handleInit (err) {
      if (err) {
        throw err
      }

      node.start(() => {
        console.log('Online status: ', node.isOnline() ? 'online' : 'offline')

        document.getElementById("status").innerHTML= 'Node status: ' + (node.isOnline() ? 'online' : 'offline')

        // You can write more code here to use it. Use methods like
        // node.files.add, node.files.get. See the API docs here:
        // https://github.com/ipfs/interface-ipfs-core/tree/master/API
      })
    }


    node.files.cat('QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY', function (err, stream) {
         var res = ''

         stream.on('data', function (chunk) {
           res += chunk.toString()
         })

         stream.on('error', function (err) {
           console.error('Error - ipfs files cat ', err)
         })

         stream.on('end', function () {
           console.log('Got:', res)
         })
       })

*/
