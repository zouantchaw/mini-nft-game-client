import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css'

// Pass in chracterNFT metadata
const Arena = ({ characterNFT }) => {
  // State
  const [gameContract, setGamecontract] = useState(null);

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(etherreum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found')
    }
  }, []);

  return (
    <div className="arena-container">
      <p>BOSS GOES HERE</p>

      <p>CHARACTER NFT GOES HERE</p>
    </div>
  );
};

export default Arena;