import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import SelectCharacter from './Components/SelectCharacter'
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import myEpicGame from './utils/MyEpicGame.json'
import { ethers } from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // State varaible used to store users public wallet
  const [currentAccount, setCurrentAccount] = useState(null);

  // State variable used to store users character NFT
  const [characterNFT, setCharacterNFT] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // checkIfWalletIsConnected will run on component load
  // async function since this method will take some time
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        setIsLoading(false);
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      // Check if we are authorized to access the users wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      // User can have multiple authorized accounts
      // Grab the first address present
      if (accounts.length !== 0) {
        console.log(`All accounts: ${accounts}`)
        const account = accounts[0];
        console.log("Found an authorized account:", account);
      } else {
        console.log("No authorized account found");
      }

    } catch (error) {
      console.log(error)
    }
    // Release state property after logic
    setIsLoading(false)
  }

  // Render Methods
  const renderContent = () => {
    // If app is loading, render LoadingIndicator
    if (isLoading) {
      return <LoadingIndicator />;
    }

    // Scenario #1
    // If user has not connected to app, show connect wallet button
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://i.gifer.com/origin/b8/b89f2f687c9cbdf204559638e5ebcbb7.gif"
            alt="Angry Pep Gif"
          />
          {
            // Button that user will use to trigger wallet connect
          }
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
            </button>
        </div>
      )
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />

      // If there is a connected wallet and characterNFT show Arena Component
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
    }
  };

  // connect wallet method
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      // method that requests access to account
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      // Prints out public address after authorizing metamask
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error)
    }
  }

  // invokes checkIfWalletIsConnected on page load
  useEffect(() => {
    // When component is mounting, set loading state to true
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  // Scenario #2 
  // If user has connected to app AND does not have a character NFF
  // show SelectCharacter component
  useEffect(() => {
    // fetchNFTMetadata will interact with smart contract
    const fetchNFTMetadata = async () => {
      console.log('Checking for the Character NFT on address', currentAccount);

      // "Provider" allows us to communicate with Ethereum nodes
      // Metamask provides nodes in the background to send/recieve data from deployed contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // abtraction of ethereum account
      // Can be used to sign messages and transactions and send signed transactions
      // to the Ethereum Network to execute state changing operations.
      const signer = provider.getSigner();

      // Initiate connection to contract
      // Takes in contract address, ABI, and signer
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

      const txn = await gameContract.checkIfUserHasNFT();
      console.log ('txn:', txn)

      // After getting response from contract,
      // check if there is a minted character NFT
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn))
      } else {
        console.log("No character NFT found");
      }
      // Set loading state to false after fetching
      setIsLoading(false)
    }

    // fetchNFTMetadata is only invoked when we have a connected wallet
    if (currentAccount) {
      console.log('Current Account', currentAccount);
      fetchNFTMetadata();
    }
    // Anytime the value of currentAccount changes, this useEffect will get fired
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">???? Angry Pep ????</p>
          <p className="sub-text">Team up to defeat the Pep Guardiola??????</p>
          {renderContent()}
        </div>
        {
          /*
          <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
          */
        }
      </div>
    </div>
  );
};

export default App;
