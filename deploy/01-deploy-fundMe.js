const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// module.exports = async ({}) => {  }
module.exports = async (hre) => {

    const { getNamedAccounts, deployments } = hre;
    const { log, deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let getEthUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const MockV3Aggregator = await deployments.get("MockV3Aggregator");
        getEthUsdPriceFeedAddress = MockV3Aggregator.address;
    } else { getEthUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]; }


    log("\n-----------------------------------------------------")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [getEthUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log("-----------------------------------------------------\n")

    if ((!developmentChains.includes(network.name)) && process.env.ETHERSCAN_APIKEY) {
        await verify(fundMe.address, [getEthUsdPriceFeedAddress])
    }


};
module.exports.tags = ["all", "fundMe"];