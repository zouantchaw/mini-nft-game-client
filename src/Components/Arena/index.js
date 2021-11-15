import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css'

// Pass in chracterNFT metadata
const Arena = ({ characterNFT }) => {
  // Contract State
  const [gameContract, setGameContract] = useState(null);

  // Boss metadata state
  const [boss, setBoss] = useState(null);

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found')
    }
  }, []);

  // UseEffects
  useEffect(() => {
   // Async function that will get the boss from contract and update state
   const fetchBoss = async () => {
     const bossTxn = await gameContract.getBigBoss();
     console.log('Boss:', bossTxn);
     setBoss(transformCharacterData(bossTxn));
   };

   if (gameContract) {
     // When gameContract is ready, invoke fetchBoss
     fetchBoss();
   }
  }, [gameContract]);

  return (
    <div className="arena-container">
      <p>BOSS GOES HERE</p>

      <p>CHARACTER NFT GOES HERE</p>
    </div>
  );
};

export default Arena;