import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import "./App.scss";
import Game from "./artifacts/contracts/Game.sol/Game.json";
import Arena from "./components/arena/Arena";
import Loader from "./components/loader/Loader";
import SelectCharacter from "./components/SelectCharacter/SelectCharacter";
import { CharacterData } from "./models/CharacterData";
import { CONTRACT_ADDRESS, transformCharacterData } from "./util/constants";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [characterNFT, setCharacterNFT] = useState<CharacterData>();
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const providerOptions = {};

    const web3Modal = new Web3Modal({
      providerOptions,
    });

    try {
      const provider = await web3Modal.connect();

      const web3 = new Web3(provider);

      const chainId = await web3.eth.getChainId();

      if (chainId === 0x4) {
        const accounts = await web3.eth.getAccounts();
        setCurrentAccount(accounts[0]);
      } else {
        alert("Choose correct Network!");
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
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
    if (isLoading) {
      return <Loader />;
    }

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
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchNFTMetadata = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Game.abi,
        signer
      );

      const characterNFT = await gameContract.checkIfUserHasNFT();
      if (characterNFT.name) {
        setCharacterNFT(transformCharacterData(characterNFT) as CharacterData);
      }

      setIsLoading(false);
    };

    if (currentAccount) {
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
