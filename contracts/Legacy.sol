pragma solidity ^0.4.24;

contract Legacy {

  /************ Variables ************/
  address public owner;

  /************ Functions ************/
  function start() public {
    owner = msg.sender;
  }  
}
