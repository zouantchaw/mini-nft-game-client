import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants'
import myEpicGame from '../../utils/MyEpicGame.json';


const SelectCharacter = ({ setCharacterNFT }) => {
  // characters holds all the character metadata we get back from contract
  const [characters, setCharacters] = useState([]);

  // gameContract allows us to use our contract in different areas
  const [gameContract, setGameContract] = useState(null);

  // Reusable contract object
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

      // set gameContract in state
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  },[]);

  // Fetching all characters
  // Listen for changes w/ gameContract
  useEffect(() => {
    // getCharacters uses gameContract to invoke getAllDefaultCharacters
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters ready for minting.')

        // Call contract to get all mint-able characters
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);

        // Transform data from characters
        const characters = charactersTxn.map((characterData) => transformCharacterData(characterData));

        // Set all mint-able characters in state
        setCharacters(characters);
      } catch (error) {
        console.log('Something went wrong fetching characters:', error)
      }
    };

    // If gameContract is ready, get characters
    if (gameContract) {
      getCharacters();
    }
  }, [gameContract])


  return (
    <div className="select-character-container">
      <h2>Mint Your Athlete. Choose wisely.</h2>
    </div>
  );
};

export default SelectCharacter;