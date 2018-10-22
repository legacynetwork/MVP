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
    address[] public beneficiaries; // The beneficiaries of this contract

    // This mapping contains data associated to each beneficiary address.
    // Currently, the associated data is simply a bytes32 with the IPFS CID of
    // the message addressed to the beneficiary. The CID must be properly
    // formatted using a base58 decoder and removing the first two bytes.
    mapping(address => bytes32) public beneficiaryData;

    /**
    * @dev contract constructor
    * @param _tPoL The Proof of Life timer length in days
    * @param _beneficiaries An array of beneficiary addresses
    * @param _messageAdds An array of IPFS CIDs of each beneficiary message
    */
    constructor(uint256 _tPoL, address[] _beneficiaries, bytes32[] _messageAdds) public {
        if(_tPoL > 0) tPoL = _tPoL * 1 days;
        else tPoL = DEFAULT_T_POL;
        tZero = now + tPoL;
        addBeneficiaries(_beneficiaries, _messageAdds);
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
    function resetPoLTimer() internal {
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
        _beneficiary.transfer(address(this).balance/beneficiaries.length);
        deleteBeneficiary(_beneficiary);
    }

    /**
    * @dev Adds new beneficiaries to this contract.
    * @param _beneficiaries An array of beneficiary addresses
    * @param _messageAdds An array of IPFS CIDs of each beneficiary message
    */
    function addBeneficiaries(address[] _beneficiaries, bytes32[] _messageAdds) public onlyOwner {
        // TODO: check if input data is valid
        for (uint8 i = 0; i < _beneficiaries.length; i++) {
            beneficiaryData[_beneficiaries[i]].messageCid = _messageCid[i];
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

    function addSecretKeepers(address[] _keepers) public onlyOwner {
        // TODO: check if input data is valid
        for (uint8 i = 0; i < _keepers.length; i++) {
            //keepersData[_keepers[i]].secretShareHash = _[i]; // TODO
            if(!isKeeper(_keepers[i])) secretKeepers.push(_keepers[i]);
        }
        resetPoLTimer();
    }

    function isKeeper(address _keeper) public view returns(bool) {
        for(uint8 i = 0; i < secretKeepers.length; i++){
            if( _keeper == secretKeepers[i]) return true;
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
    * @param _beneficiaryAddress The beneficiary address
    * @return Returns the message CID (bytes32) of the given beneficiary
    */
    function getMessageCID(address _beneficiaryAddress)
        public view returns(bytes32)
    {
        return beneficiaryData[_beneficiaryAddress];
    }

    function kill() public onlyOwner { selfdestruct(owner); }

}
