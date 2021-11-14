const CONTRACT_ADDRESS = '0x20f47De2A725d2fe55566e6cdeD9a1C3298F105f';

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