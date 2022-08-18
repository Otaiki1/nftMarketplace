//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
//import the openzepellin interface for the marketplace functions
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import the openzeppelin reentrancy guard contracts
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard{
    //first the account that would collect the fees
    address payable public immutable feeAccount;
    //the fee percentage on sales
    uint public immutable feePercent;
    uint public itemCount;

    //the immutable variables would be initialized in the constructor
    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);//initializes the account collecting fees as deployer
        feePercent  = _feePercent;//sets the fee percent
    }
    

}

