const CONTRACT_ADDRESS = '0x3399eC4b13dA7b68c9aEb6884aD9eaBe90aBDA1b';

// Puts data from smart contract into an object that easily accessible by client
const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };