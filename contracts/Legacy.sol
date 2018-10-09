 // simplified contract prototype that does not implement encryption

pragma solidity ^0.4.24;


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


contract Legacy is Owned{

    // constant parameters
    uint256 constant DEFAULT_T_POL = 90 * 1 days;
    
    // state variables    
    uint256 public tPoL;
    uint256 public tZero;       
    address[] public beneficiaries;
    
    // TODO: used fixed length bytes array
    mapping(address => string) public beneficiaryData;
    
    constructor(uint256 _tPoL) public {
        if(_tPoL > 0) tPoL = _tPoL * 1 days;
        else tPoL = DEFAULT_T_POL;
        
        tZero = now + tPoL;
     }

    function() public payable {
        if(msg.sender == owner) resetPoLTimer();
    }

    function giveProofOfLife() public onlyOwner {
        resetPoLTimer();
    }

    function getProofOfLife() public view returns(bool) {
        if (now > tZero) return false;
        else return true;
    }

    function resetPoLTimer() internal {
        // TODO: make sure cannot be called externally by anyone
        // apart from the owner
        tZero = tZero + tPoL;
    }

    function setPoLTimerLength(uint256 _tPoL) public onlyOwner {
        if(_tPoL > 0) tPoL = _tPoL * 1 days;
        resetPoLTimer();
    }
    
    function claimFunds(address _beneficiary) public {
        require(isBeneficiary(_beneficiary));
        require(!getProofOfLife());
        _beneficiary.transfer(address(this).balance/beneficiaries.length);
        deleteBeneficiary(_beneficiary);
    }
    
    function addBeneficiary(address _beneficiary, string _messageUrl) public onlyOwner {
        // TODO: check if input data is valid
        beneficiaryData[_beneficiary]  = _messageUrl;        
        if(!isBeneficiary(_beneficiary)) beneficiaries.push(_beneficiary);
        resetPoLTimer();
    }

    function deleteBeneficiary(address _beneficiary) public onlyOwner {
        delete beneficiaryData[_beneficiary];
        int8 index = -1;
        for (uint8 i = 0; i < beneficiaries.length; i++) {
            if (beneficiaries[i] == _beneficiary) {
                //delete beneficiaries[i]; // just reinitializes b[i] to default value
                index = int8(i);
                break;
            }
        }
        if (index > -1) {
            for (i = uint8(index); i < beneficiaries.length; i++) {
                beneficiaries[i] = beneficiaries[i+1];
            }
            beneficiaries.length--;
        }
    }

    function isBeneficiary(address _beneficiary) public view returns(bool) {
        for(uint8 i = 0; i < beneficiaries.length; i++){
            if( _beneficiary == beneficiaries[i]) return true;
        }
        return false;
    }    

    function withdraw(uint amount) public onlyOwner {
        if (address(this).balance >= amount) {
            msg.sender.transfer(amount);
        }
        resetPoLTimer();
    }
    
    function kill() public onlyOwner { selfdestruct(owner); }
    
}