import { ethers } from "hardhat";

async function main() {
  const gameContractFactory = await ethers.getContractFactory('Game');

  const gameContract = await gameContractFactory.deploy(
    ["Leo", "Aang", "Pikachu"],
    ["https://i.imgur.com/pKd5Sdk.png",
      "https://i.imgur.com/xVu4vFL.png",
      "https://i.imgur.com/u7T87A6.png"],
    [100, 200, 300],
    [100, 50, 25],
    "Elon Musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
  );

  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
