require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
// require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
let SepUrl = process.env.SEPOLIA_URL || " ";
let pvtkey = process.env.PRIVATE_KEY || " ";
let apiKey = process.env.ETHERSCAN_APIKEY || " ";
let cmckey = process.env.coinMarketCapKey || " ";



module.exports = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  networks: {
    sepolia: {
      url: SepUrl,
      accounts: [pvtkey],
      chainId: 11155111,
      blockConfirmations: 6
    },
    localhost: { // to work like ganache
      url: "http://127.0.0.1:8545/",
      // accounts are provided by hardhat
      chainId: 31337
    }
  },
  etherscan: {
    apiKey
  },
  solidity: "0.8.19",
  gasReporter: {
    enabled: false,
    // currency: "INR",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: cmckey
    // token : "MATIC" (to get in polygon instead of eth)
  }
};
