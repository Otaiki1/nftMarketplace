
import logo from './logo.png';
import './App.css';
import {ethers} from "ethers";
import {useState} from 'react';

import MarketplaceAddress from "../contractsData/Marketplace-address.json";
import MarketplaceAbi from "../contractsData/Marketplace.json";

import NFTAddress from "../contractsData/NFT-address.json";
import NFTAbi from "../contractsData/NFT.json";



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
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 ms-3"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dapp University
        </a>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mx-auto mt-5">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} className="App-logo" alt="logo"/>
              </a>
              <h1 className= "mt-5">Dapp University Starter Kit</h1>
              <p>
                Edit <code>src/frontend/components/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
                LEARN BLOCKCHAIN <u><b>NOW! </b></u>
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
