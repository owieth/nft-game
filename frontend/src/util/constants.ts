import { CharacterData } from "../models/CharacterData";

const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS_GOES_HERE';

/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData: CharacterData) => {
    return {
        name: characterData.name,
        imageURI: characterData.imageURI,
        hp: characterData.hp,
        maxHp: characterData.maxHp,
        attackDamage: characterData.attackDamage,
    };
};

export { CONTRACT_ADDRESS, transformCharacterData };