const { network } = require("hardhat");
const { networkConfig, developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { log, deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if (developmentChains.includes(network.name || chainId === 31337)) {
        log("\n-------------------------------------------------------------");
        log("Local network detected, Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        })
        log("Mocks deployed !!");
        log("----------------------------------------------------------------\n");
    }
}

module.exports.tags = ["all", "mocks"];