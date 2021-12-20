import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Game from "../../artifacts/contracts/Game.sol/Game.json";
import { CharacterData } from "../../models/CharacterData";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../util/constants";
import Loader from "../loader/Loader";
import "./SelectCharacter.scss";

const SelectCharacter = ({ setCharacterNFT }: any) => {
  const [characters, setCharacters] = useState<CharacterData[]>([]);
  const [gameContract, setGameContract] = useState<ethers.Contract>();
  const [mintingCharacter, setMintingCharacter] = useState(false);

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Game.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        const charactersTxn = await gameContract?.getAllDefaultCharacters();

        const characters = charactersTxn.map((characterData: CharacterData) =>
          transformCharacterData(characterData)
        );

        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    const onCharacterMint = async () => {
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        setCharacterNFT(transformCharacterData(characterNFT) as CharacterData);
      }
    };

    if (gameContract) {
      getCharacters();

      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  const mintNFT = (characterId: number) => async () => {
    try {
      if (gameContract) {
        setMintingCharacter(true);

        const mintTxn = await gameContract.mintNFT(characterId);
        await mintTxn.wait();

        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
      setMintingCharacter(false);
    }
  };

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
          onClick={mintNFT(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <Loader />
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
