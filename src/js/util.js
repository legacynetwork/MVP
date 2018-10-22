const bs58 = require('bs58')

const util = {
  
  ipfsHashToBytes: function(hash) {
    let bytes = bs58.decode(hash);
    // first 2 bytes are hash function identifier and length
    let multiHashIdLen = 2;
    // remove the multihash hash id
    return '0x' + bytes.slice(multiHashIdLen, bytes.length).toString('hex');
  },
  
  bytesToIpfsHash: function(bytes32Hex) {
    const hashHex = "1220" + bytes32Hex.slice(2)
    const hashBytes = Buffer.from(hashHex, 'hex');
    const hashStr = bs58.encode(hashBytes)
    return hashStr
  }

}

export default util