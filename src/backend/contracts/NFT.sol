//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    //Varriable that marks token count
    uint public tokenCount;

    //mapping that maps each addresses to their list of ids
    mapping(address => uint[]) private _nftList;

    constructor() ERC721("Dapp NFT", "DFT") {}

    //Note that the token uri serves as where the metadata is stored and the metadata in this case is link to the ipfs client
    function mint(string memory _tokenURI) external returns (uint) {
        //we increase the total amount of NFTs first
        tokenCount++;
        //this mints the nft and uses the token count as its ID
        _safeMint(msg.sender, tokenCount);
        //Update the mapping
        _nftList[msg.sender].push(tokenCount);
        //sets the token metadata to the id
        _setTokenURI(tokenCount, _tokenURI);
        return (tokenCount);
    }

    //A function that updates nft list when user buys the nft
    // that from address would be gotten from the dapp

    function updateNftList(
        address _from,
        uint _index,
        uint _tokenId
    ) external {
        //ensure the person calling the function is the owner of the token
        address ownerAddress = ownerOf(_tokenId);
        require(ownerAddress == msg.sender, "Only owner can update List");
        //delete the asset from the nft list
        uint arrLen = _nftList[_from].length;
        _nftList[_from][_index] = _nftList[_from][arrLen - 1];
        _nftList[_from].pop();
        //update the nftList for the new person
        _nftList[msg.sender].push(_tokenId);
    }

    function getNftList(address _addr) external view returns (uint[] memory) {
        return _nftList[_addr];
    }
}
