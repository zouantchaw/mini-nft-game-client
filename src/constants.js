const CONTRACT_ADDRESS = '0xcf7112f9F522851D89482c519A53E49248D7Dc95';

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