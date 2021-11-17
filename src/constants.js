const CONTRACT_ADDRESS = '0xa5f0f44D4eDD0C0F3F2905FEc5241D48394912f6';

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