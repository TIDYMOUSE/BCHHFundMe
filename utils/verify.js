const { run } = require("hardhat");

const verify = async (contanctAddress, args) => {
    console.log("\n-----------------------------------------------------");

    console.log("verifying the contract...");
    try {
        await run("verify:verify", {
            address: contanctAddress,
            constructorArguments: args
        });
    } catch (error) {
        console.log(error);
    }

    console.log("-----------------------------------------------------\n");
}

module.exports = {
    verify
}