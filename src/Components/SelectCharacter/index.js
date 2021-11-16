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

  // Minting state property
  const [mintingCharacter, setMintingCharacter] = useState(false);

  // Actions
  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        // Show loading indicator
        setMintingCharacter(true);
        console.log('Minting character in progress...');
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log('mintTxn:', mintTxn);
        // Remove loading indicator when minting is complete
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn('MintChracterAction Error:', error);
      // If there's an error, hide the loading indicator
      setMintingCharacter(false);
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

      // Callback method that fires anytime a new character NFT is minted
      const onCharacterMint = async (sender, tokenId, characterIndex) => {
        console.log(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`)
        alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`)
        // Once minted, fetch metadata from contract and set it in state state for Arena component
        if (gameContract) {
          // invoke checkIfUserHasNFT on gameContract
          const characterNFT = await gameContract.checkIfUserHasNFT();
          console.log('CharacterNFT: ', characterNFT);
          // Transform data and update state
          setCharacterNFT(transformCharacterData(characterNFT));
        }
      };

      if (gameContract) {
        getCharacters();
        // Use gameContract object to listen for CharacterNFTMinted invocation from contract
        gameContract.on('CharacterNFTMinted', onCharacterMint)
        console.log("Listening for 'CharacterNFTMinted' event on contract");
      }

      // Stop listening to 'CharacterNFTMinted' event wehn the component is not being used anymore
      return () => {
        // When component unmounts, clean up listener
        if (gameContract) {
          gameContract.off('CharacterNFTMinted', onCharacterMint);
          console.log("Stopped listening for 'CharacterNFTMinted' event on contract");
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
    {characters.length > 0 && (
      <div className="character-grid">{renderCharacters()}</div>
    )}
    {/* Only show our loading state if mintingCharacter is true */}
    {mintingCharacter && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
        <img
          src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
          alt="Minting loading indicator"
        />
      </div>
    )}
  </div>
);

};

export default SelectCharacter;