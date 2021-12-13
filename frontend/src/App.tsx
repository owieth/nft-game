import { check } from "prettier";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import "./App.scss";
import SelectCharacter from "./components/SelectCharacter/SelectCharacter";
import Game from "./artifacts/contracts/Game.sol/Game.json";
import { CONTRACT_ADDRESS, transformCharacterData } from "./util/constants";
import { ethers } from "ethers";
import { CharacterData } from "./models/CharacterData";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [characterNFT, setCharacterNFT] = useState<CharacterData>();

  const checkIfWalletIsConnected = async () => {
    const providerOptions = {};

    const web3Modal = new Web3Modal({
      providerOptions, // required
    });

    try {
      const provider = await web3Modal.connect();

      const web3 = new Web3(provider);

      const chainId = await web3.eth.getChainId();

      console.log(chainId);

      if (chainId === 0x4) {
        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);
      } else {
        alert("Choose correct Network!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={checkIfWalletIsConnected}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderContent = () => {
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={renderNotConnectedContainer}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
      /*
       * Scenario #2
       */
    } else if (currentAccount && !characterNFT) {
      // return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
      return <SelectCharacter />;
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    /*
     * The function we will call that interacts with out smart contract
     */
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Game.abi,
        signer
      );

      const txn: CharacterData = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn) as CharacterData);
      } else {
        console.log("No character NFT found");
      }
    };

    /*
     * We only want to run this, if we have a connected wallet
     */
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
