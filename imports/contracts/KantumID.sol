pragma solidity ^0.4.11;

contract mortal {
    address public administrator;

    function mortal() {
        administrator = msg.sender;
    }

    function withdraw() {
        if (msg.sender == administrator) {
          // Change send to transfer
            while(!administrator.send(this.balance)){}
        }
    }

    function kill() {
        selfdestruct(administrator);
    }
}

contract KantumID is mortal {
   mapping (bytes32 => address) usernameToAddress;

   event BroadcastPublicKey(bytes32 indexed username, address indexed addr, string publicKey);
   event SendData(bytes32 datalId, address indexed from, address indexed to, string ipfsHash, bytes32 indexed inReplyToId, string inReplyToIpfsHash);
   //event SaveData(bytes32 datalId, address indexed username, string ipfsHash);

   function registerUser(bytes32 username, string publicKey) returns (bool) {
       if(usernameToAddress[username] != 0) {
           throw;
       }

       usernameToAddress[username] = msg.sender;

       BroadcastPublicKey(username, msg.sender, publicKey);

       return true;
   }

   function sendData(address to, string ipfsHash, bytes32 inReplyToId, string inReplyToIpfsHash) returns (bool result) {
       SendData(sha3(ipfsHash), msg.sender, to, ipfsHash, inReplyToId, inReplyToIpfsHash);

       return true;
   }
}
