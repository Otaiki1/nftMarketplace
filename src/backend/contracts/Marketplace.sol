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
    //an event thats is triggered whenever an item is bought from the marketplace
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
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

    //function for purchasing item in the marketplace
    function purchaseItem(uint _itemId) external payable nonReentrant{
        //get the total price
        uint _totalPrice = getTotalPrice(_itemId);
        //get the item
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesnt exist");//check to make sure the item being bought exists
        require(msg.value >= _totalPrice, "You dont have enough ether to buy this nft");//check that the persomn buying is sending enough ether
        require(!item.sold, "item has already been sold");

        //pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);

        //update item to sold
        item.sold = true;

        //transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        //emit Bought event

        emit Bought(itemCount, address(item.nft), item.tokenId, item.price, item.seller, msg.sender);

    }
    
    //a function that gets the price of the nft with the fees added
    function getTotalPrice(uint _itemId) view public returns(uint){
        return(items[_itemId].price * (100 + feePercent)/100);
    } 
    

}

