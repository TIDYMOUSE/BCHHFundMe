const { getNamedAccounts, ethers, deployments } = require("hardhat")

async function main() {
    const [deployer] = await ethers.getSigners();
    const fundMe = await ethers.deployContract("FundMe", [deployer]);
    await fundMe.waitForDeployment();

    console.log("Funding one ether" + await ethers.provider.getBalance(deployer.address));
    const transactionResponse = await fundMe.fund();
    await transactionResponse.wait(1);
    console.log("done!");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});