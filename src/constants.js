const CONTRACT_ADDRESS = '0xB159ffBAfD95aaBCdb522d0eeF13cD5712a1A868';

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