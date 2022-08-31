//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    //Varriable that marks token count
    uint public tokenCount;

    mapping(address => string[]) public nftList;

    constructor() ERC721("Dapp NFT", "DFT") {}

    //Note that the token uri serves as where the metadata is stored and the metadata in this case is link to the ipfs client
    function mint(string memory _tokenURI) external returns (uint) {
        //we increase the total amount of NFTs first
        tokenCount++;
        //get the index for the nftList mapping
        uint nftCount = balanceOf(msg.sender);
        //this mints the nft and uses the token count as its ID
        _safeMint(msg.sender, tokenCount);
        //Update the mapping
        nftList[msg.sender][nftCount] = _tokenURI;
        //sets the token metadata to the id
        _setTokenURI(tokenCount, _tokenURI);
        return (tokenCount);
    }
}
