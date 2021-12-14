import { CharacterData } from "../models/CharacterData";

const CONTRACT_ADDRESS = '0x18378200A10E5390EAdA77BF1246fEdB4C991a1A';

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