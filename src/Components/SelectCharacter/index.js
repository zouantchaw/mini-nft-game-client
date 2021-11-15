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

  // Actions
  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
      }
    } catch (error) {
      console.log('MintChracterAction Error:', error);
    }
  };

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

      // Callback method that fires when this event is recieved
      const onCharacterMint = async (sender, tokenId, characterIndex) => {
        console.log(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`)

        // Once minted, fetch metadata from contract and set it in state state for Arena component
        if (gameContract) {
          const characterNFT = await gameContract.checkIfUserHasNFT();
          console.log('CharacterNFT: ', characterNFT);
          setCharacterNFT(transformCharacterData(characterNFT));
        }
      };

      if (gameContract) {
        getCharacters();
        // NFT minted Listener
        gameContract.on('CharacterNFTMinted', onCharacterMint)
      }

      return () => {
        // When component unmounts, clean up listener
        if (gameContract) {
          gameContract.off('CharacterNFTMinted', onCharacterMint);
        }
      };
  }, [gameContract]);

  // Render Method
  const renderCharacters = () =>
  characters.map((character, index) => (
    <div className="character-item" key={character.name}>
      <div className="name-container">
        <p>{character.name}</p>
      </div>
      <img src={character.imageURI} alt={character.name} />
      <button
        type="button"
        className="character-mint-button"
        onClick={mintCharacterNFTAction(index)}
      >{`Mint ${character.name}`}</button>
    </div>
  ));



  return (
    <div className="select-character-container">
      <h2>Mint Your Athlete. Choose wisely.</h2>

      {/*Only shows when there are characters in state*/}
      {
        characters.length > 0 && (
          <div className="character-grid">{renderCharacters()}</div>
        )
      }
    </div>
  );
};

export default SelectCharacter;