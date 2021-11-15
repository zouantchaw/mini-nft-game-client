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

  // Actions 
  const runAttackAction = async () => {}

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
    {/* Replace your Boss UI with this */}
    {boss && (
      <div className="boss-container">
        <div className={`boss-content`}>
          <h2>🔥 {boss.name} 🔥</h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button className="cta-button" onClick={runAttackAction}>
            {`💥 Attack ${boss.name}`}
          </button>
        </div>
      </div>
    )}

    {/* Character NFT */}
    <p>CHARACTER NFT GOES HERE</p>
  </div>
);
};

export default Arena;