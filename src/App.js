import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // State varaible used to store users public wallet
  const [currentAccount, setCurrentAccount] = useState(null);

  // checkIfWalletIsConnected will run on component load
  // async function since this method will take some time
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
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
  }

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
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
