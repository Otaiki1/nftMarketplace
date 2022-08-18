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

    //store data of the item 
    struct Item{
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    //an event thats is triggered whenever an item is added to the marketplace
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    
    //mapping the itemId to the item
    mapping(uint => Item) public items;

    //the immutable variables would be initialized in the constructor
    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);//initializes the account collecting fees as deployer
        feePercent  = _feePercent;//sets the fee percent
    }

    function createItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant{
        require(_price > 0, "Price Must be greater than 0");
        //increment item count
        itemCount++;
        //transfer nfts
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        //add a new item to the items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );
        emit Offered(itemCount, address(_nft), _tokenId, _price, msg.sender);
    }
    

}

