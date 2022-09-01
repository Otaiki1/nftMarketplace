//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    //Varriable that marks token count
    uint public tokenCount;

    //mapping that maps each addresses to their list of ids
    mapping(address => uint[]) private nftList;

    constructor() ERC721("Dapp NFT", "DFT") {}

    //Note that the token uri serves as where the metadata is stored and the metadata in this case is link to the ipfs client
    function mint(string memory _tokenURI) external returns (uint) {
        //we increase the total amount of NFTs first
        tokenCount++;
        //this mints the nft and uses the token count as its ID
        _safeMint(msg.sender, tokenCount);
        //Update the mapping
        nftList[msg.sender].push(tokenCount);
        //sets the token metadata to the id
        _setTokenURI(tokenCount, _tokenURI);
        return (tokenCount);
    }

    function getNftList(address _addr) external view returns (uint[] memory) {
        return nftList[_addr];
    }
}
