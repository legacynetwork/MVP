pragma solidity ^0.4.24;

/**
 * @title Owned
 * @dev Contract implementing a simple access control modifier
 */
contract Owned {

    address owner;

    constructor() public { owner = msg.sender; }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}

/**
 * @title Legacy's main contract MVP
 * @author Legacy team <contact@legaccydapp.com>
 */
contract Legacy is Owned{

    // constant parameters
    uint256 constant DEFAULT_T_POL = 90 * 1 days;

    // state variables
    uint256 public tPoL;  // The Proof of Life timer length
    uint256 public tZero; // Indicates when the PoL timer reaches "zero"
    uint8 public k; // minimum number of keepers required to unlock the contract
    uint8 public n; // total number of keepers
    address[] public beneficiaries; // Beneficiaries' addresses of this contract
    address[] public secretKeepers; // The secret keepers of this contract

    // messageCID corresponds to the IPFS Content IDentifier of the message
    // addressed to the beneficiary. The CID must be properly formatted using
    // a base58 decoder and removing the first two bytes (resulting in 32 Bytes)
    struct beneficiary {
      bytes32 messageCID;
      bytes32 keyHash;
    }

    // secretShare should be set after only after PoL = false
    struct keeper {
      bytes32 secretShare;
      bytes32 secretShareHash; // sha3 of secretShare
      uint8 secretShareIndex; // 0 <= index < n
    }


    // This mapping contains data associated to each *beneficiary* address.
    // The associated data is defined in the struct beneficiary.
    mapping(address => beneficiary) public beneficiaryData;

    // This mapping contains data associated to each *keeper* address.
    // The associated data is defined in the struct keeper.
    mapping(address => keeper) public keeperData;

    /**
    * @dev contract constructor
    * @param _tPoL The Proof of Life timer length in days
    * @param _beneficiaries An array of beneficiary addresses
    * @param _messageCIDs An array of IPFS CIDs of each beneficiary message
    */
    constructor(
        uint256 _tPoL,
        address[] _beneficiaries,
        bytes32[] _messageCIDs,
        bytes32[] _keyHashes
    ) public {
        if(_tPoL > 0) tPoL = _tPoL * 1 days;
        else tPoL = DEFAULT_T_POL;
        tZero = now + tPoL;
        addBeneficiaries(_beneficiaries, _messageCIDs, _keyHashes);
    }

    /**
    * @dev fallback function
    */
    function() public payable {
        if(msg.sender == owner) resetPoLTimer();
    }

    /**
    * @return The address of the contract owner
    */
    function getOwnerAddress() public view returns(address) {
        return owner;
    }

    /**
    * @dev Resets the PoL timer. Should only be called by the contract owner
    */
    function giveProofOfLife() public onlyOwner {
        resetPoLTimer();
    }

    /**
    @return True if the PoL timer hasn't reached tZero
    */
    function getProofOfLife() public view returns(bool) {
        if (now > tZero) return false;
        else return true;
    }

    /**
    * @dev Resets the PoL timer. Should only be called by other functions in
    *      this contract with the onlyOwner modifier
    */
    function resetPoLTimer() private {
        tZero = tZero + tPoL;
    }

    /**
    * @dev Sets the Proof of Life timer length and resets the timer
    * @param _tPoL The Proof of Life timer length in days
    */
    function setPoLTimerLength(uint256 _tPoL) public onlyOwner {
        if(_tPoL > 0) tPoL = _tPoL * 1 days;
        resetPoLTimer();
    }

    /**
    * @dev Transfer funds allocated to a given beneficiary
    *      TODO: the parameter _beneficiary might be redundant
    * @param _beneficiary The address of the beneficiary claiming the funds
    */
    function claimFunds(address _beneficiary) public {
        require(isBeneficiary(_beneficiary));
        require(!getProofOfLife());
        // for now, we assume funds are split equitably among all beneficiaries
        _beneficiary.transfer(address(this).balance/beneficiaries.length);
        deleteBeneficiary(_beneficiary);
    }

    /**
    * @dev Adds new beneficiaries to this contract.
    * @param _beneficiaries An array of beneficiary addresses
    * @param _messageCIDs An array of IPFS CIDs of each beneficiary message
    * @param _keyHashes An array of sha3 of the beneficiaries' decryption keys
    */
    function addBeneficiaries(
        address[] _beneficiaries,
        bytes32[] _messageCIDs,
        bytes32[] _keyHashes
    ) public onlyOwner {
        // TODO: check if input data is valid
        for (uint8 i = 0; i < _beneficiaries.length; i++) {
            beneficiaryData[_beneficiaries[i]].messageCID = _messageCIDs[i];
            beneficiaryData[_beneficiaries[i]].keyHash = _keyHashes[i];
            if(!isBeneficiary(_beneficiaries[i])) beneficiaries.push(_beneficiaries[i]);
        }
        resetPoLTimer();
    }

    /**
    * @dev Deletes a beneficiary from the array beneficiaries
    * @param _beneficiary The beneficiary address
    */
    function deleteBeneficiary(address _beneficiary) public onlyOwner {
        delete beneficiaryData[_beneficiary];
        int8 index = -1;
        for (uint8 i = 0; i < uint8(beneficiaries.length); i++) {
            if (beneficiaries[i] == _beneficiary) {
                //delete beneficiaries[i]; // just reinitializes b[i] to default value
                index = int8(i);
                break;
            }
        }
        if (index > -1) {
            for (i = uint8(index); i < uint8(beneficiaries.length-1); i++) {
                beneficiaries[i] = beneficiaries[i+1];
            }
            //delete beneficiaries[beneficiaries.length-1]; // this should save gas
            beneficiaries.length--;
        }
    }

    /**
    * @dev Checks if a given address is in the state variable array beneficiaries
    * @param _beneficiary The address of the beneficiary
    * @return True if _beneficiary is in the array beneficiaries
    */
    function isBeneficiary(address _beneficiary) public view returns(bool) {
        for(uint8 i = 0; i < beneficiaries.length; i++){
            if( _beneficiary == beneficiaries[i]) return true;
        }
        return false;
    }

    /**
    * @dev Saves the secret keepers of the contract
    */
    function assignSecretKeepers(
        address[] _keepers,
        bytes32[] _secretShareHashes,
        uint8[] _secretShareIndexes
    ) public onlyOwner {
        /*require(
          secretKeepers.length == 0,
          "It seems that the keepers of this contract have already been set"
        );*/
        for (uint8 i = 0; i < _keepers.length; i++) {
            keeperData[_keepers[i]].secretShareHash = _secretShareHashes[i];
            keeperData[_keepers[i]].secretShareIndex = _secretShareIndexes[i];
            if(!isKeeper(_keepers[i])) secretKeepers.push(_keepers[i]);
        }
        resetPoLTimer();
    }

    /**
    * @dev saves the secret share of a keeper
    * @param _keeper the secret keeper address
    * @param _secretShare the secret share to be saved
    */
    function saveSecretShare(address _keeper, bytes32 _secretShare) public {
        if (keeperData[_keeper].secretShareHash == keccak256(
          abi.encodePacked(_secretShare)))
            keeperData[_keeper].secretShare = _secretShare;
    }

    /**
    * @dev Checks if an address is in the state variable array secretKeepers
    * @param _keeper The keeper address to test
    * @return True if _keeper is in the array secretKeepers
    */
    function isKeeper(address _keeper) public view returns(bool) {
        for (uint8 i = 0; i < secretKeepers.length; i++) {
            if (_keeper == secretKeepers[i]) return true;
        }
        return false;
    }

    /**
    * @dev Transfer funds from this contract to the contract owner address
    * @param amount The amount of funds to be transfered
    */
    function withdraw(uint amount) public onlyOwner {
        if (address(this).balance >= amount) {
            msg.sender.transfer(amount);
        }
        resetPoLTimer();
    }

    /**
    * @dev A simple getter for the state varible array beneficiaries
    * @return Returns the array of beneficiaries
    */
    function getBeneficiaries() public view returns(address[]){
        return beneficiaries;
    }

    /**
    * TODO: possibly not required as accessible with default getter
    * @param _beneficiaryAddress The beneficiary address
    * @return Returns the message CID (bytes32) of the corresponding beneficiary
    */
    function getMessageCID(address _beneficiaryAddress)
        public view returns(bytes32)
    {
        return beneficiaryData[_beneficiaryAddress].messageCID;
    }

    /**
    * @dev A simple getter for the state varible array secretKeepers
    * @return Returns the array of secretKeepers
    */
    function getSecretKeepers() public view returns(address[]){
        return secretKeepers;
    }

    function kill() public onlyOwner { selfdestruct(owner); }

}
