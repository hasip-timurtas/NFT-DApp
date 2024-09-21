require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load .env variables

console.log(process.env.INFURA_PROJECT_ID);
console.log(process.env.ETH_PRIVATE_KEY);

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.ETH_PRIVATE_KEY}`]
    }
  },
};
