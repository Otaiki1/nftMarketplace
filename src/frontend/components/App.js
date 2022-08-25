import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Navigation from "./Navbar";
import {Spinner} from "react-bootstrap";
import {ethers} from "ethers";
import {useState} from 'react';

import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../contractsData/Marketplace.json";

import NFTAddress from "../contractsData/NFT-address.json";
import NFTAbi from "../contractsData/NFT.json";

import Home from "./Home";
import Create from "./Create";
import MyListedItem from "./MyListedItem";
import MyPurchases from "./MyPurchases";

function App() {
  const [account, setAccount] = useState(null);
  const [marketplace, setMarketplace] = useState({});
  const [NFT, setNFT] = useState({});
  const [loading, setLoading] = useState({});

  const {ethereum} = window;
  //Metamask login and connect
  const web3Handler = async() => {
    const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    setAccount(accounts[0]);
    //get provider from metamsk
    const provider = new ethers.providers.Web3Provider(ethereum);
    //set signer
    const signer = provider.getSigner();
    loadContracts(signer);
  }    
  
  const loadContracts = async(_signer) =>{
    const _marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, _signer);
    setMarketplace(_marketplace);

    const _nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, _signer)
    setNFT(_nft);

    setLoading(false);
  }

  return (
    <BrowserRouter>
    <div className='App'>
      <Navigation web3Handler={web3Handler} account={account} />
      {loading ? (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
         <Spinner animation="border" style={{ display: 'flex' }} />
         <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
       </div>
      ):(
        <Routes>
          <Route path="/" element={
            <Home marketplace={marketplace} nft={NFT}/>
          } />
          <Route path="/create" element={
            <Create marketplace={marketplace} nft={NFT}/>
          } />
          <Route path="/my-listed-items" element={
            <MyListedItem marketplace={marketplace} nft={NFT} account={account} />
          } />
          <Route path="/my-purchases" element={
            <MyPurchases marketplace={marketplace} nft={NFT} account={account} />
          } />
      </Routes>
      )}
      
    </div>
    </BrowserRouter>
    
  );
}

export default App;
