import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTACT_ADDRESS, transformCharacterData } from '../../constants'
import myEpicGame from '../../utils/MyEpicGame.json';


const SelectCharacter = ({ setCharacterNFT }) => {
  // characters holds all the character metadata we get back from contract
  const [characters, setCharacters] = useState([]);

  // gameContract allows us to use our contract in different areas
  const [gameContract, setGameContract] = useState(null);

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.provider.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTACT_ADDRESS, myEpicGame, signer);

      // set gameContract in state
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  },[]);


  return (
    <div className="select-character-container">
      <h2>Mint Your Athlete. Choose wisely.</h2>
    </div>
  );
};

export default SelectCharacter;