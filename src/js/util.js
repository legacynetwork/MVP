const bs58 = require('bs58')

const util = {
  
  ipfsHashToBytes: function(hash) {
    let bytes = bs58.decode(hash);
    // first 2 bytes are hash function identifier and length
    let multiHashIdLen = 2;
    // remove the multihash hash id
    return '0x' + bytes.slice(multiHashIdLen, bytes.length).toString('hex');
  },

  // TODO
  bytesToIpfsHash: function() {}

}

export default util