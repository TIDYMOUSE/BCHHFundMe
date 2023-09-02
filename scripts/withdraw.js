const { parseEther } = require("ethers");
const { getNamedAccounts, ethers, deployments } = require("hardhat")

async function main() {
    const deployer = (await getNamedAccounts()).deployer;
    const fundMeAddress = (await deployments.get("FundMe")).address
    const fundMe = await ethers.getContractAt("FundMe", fundMeAddress);

    console.log("withdrawing one ether");
    const transactionResponse = await fundMe.withdraw(parseEther("1"), fundMe.owner());
    await transactionResponse.wait(1);
    console.log("done!");

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});