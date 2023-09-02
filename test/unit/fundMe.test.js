const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name) ? describe.skip :
    describe("fundMe", () => {

        let fundMe;
        let deployer;
        let MockV3Aggregator;
        let MockV3AggregatorAddress, fundMeAddress;

        let val = ethers.parseEther("1");

        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["all"]);
            // const account = (await ethers.getSigners())[0];
            fundMeAddress = (await deployments.get("FundMe")).address;
            MockV3AggregatorAddress = (await deployments.get("MockV3Aggregator")).address
            fundMe = await ethers.getContractAt("FundMe", fundMeAddress);
            MockV3Aggregator = await ethers.getContractAt("MockV3Aggregator", MockV3AggregatorAddress);
        })

        describe("constructor", () => {
            it("assigns aggregator address correctly", async () => {
                const response = await fundMe.priceFeed();
                assert.equal(response, MockV3AggregatorAddress, "Could fetch MockV3Aggregators address");
            })
        })

        describe("fund", () => {
            it("fails for insufficient eth", async () => {
                await expect(fundMe.fund()).to.be.revertedWith("Put more, Bro");
            })

            it("Updates funder array", async () => {
                await fundMe.fund({ value: val });
                const response = await fundMe.fundersAdd(0);
                assert.equal(response, deployer)
            })

            it("Updates map of funders", async () => {
                await fundMe.fund({ value: val })
                const response = await fundMe.funders(deployer);
                assert.equal(response.toString(), val.toString());
            })

        })

        describe("withdraw", () => {
            beforeEach(async () => {
                await fundMe.fund({ value: val });
            })

            it("Manages transactions properly for single funding", async () => {
                // ethers.provider.get
                const startBalContract = await ethers.provider.getBalance(fundMeAddress);
                const startBalDeployer = await ethers.provider.getBalance(deployer);

                const transactionResponse = await fundMe.withdraw(ethers.parseEther("0.5"), deployer);
                const transactionReceipt = await transactionResponse.wait(1);

                const { gasPrice, gasUsed } = transactionReceipt;
                const gasCost = gasPrice * gasUsed;

                const finalBalContract = await ethers.provider.getBalance(fundMeAddress);
                const finalBalDeployer = await ethers.provider.getBalance(deployer);

                assert.equal(finalBalContract, ethers.parseEther('0.5'));
                assert.equal(finalBalContract + startBalDeployer, finalBalDeployer + gasCost);
            })

            it("Updates funders after withdrawal", async () => {
                const startBalContract = await ethers.provider.getBalance(fundMeAddress);
                const transactionResponse = await fundMe.withdraw(ethers.parseEther('0.5'), deployer);
                assert.equal((startBalContract - BigInt(await fundMe.funders(deployer))).toString(), ethers.parseEther("0.5"));
            })

            it("Checks for sufficient withdrawal amount", async () => {
                await expect(fundMe.withdraw(ethers.parseEther("2"), deployer)).to.be.revertedWith("You are asking for too much");
            })

            it("Manages transactions properly for multiple funding", async () => {
                const accounts = await ethers.getSigners();
                for (let i = 1; i < 5; i++) {
                    const fundMeContract = await fundMe.connect(accounts[i]);
                    let tp = await fundMeContract.owner();
                    await fundMeContract.fund({ value: val });

                    //alternate method
                    // const transactionResponse = await accounts[i].sendTransaction({
                    //     to: fundMeAddress,
                    //     value: ethers.parseEther("1")
                    // })
                    // const transactionReceipt = await transactionResponse.wait(1);
                }

                const startBalContract = await ethers.provider.getBalance(fundMeAddress);
                const startBalDeployer = await ethers.provider.getBalance(deployer);
                let gasCost = BigInt(0);
                for (let i = 1; i < 5; i++) {
                    const transactionResponse = await fundMe.withdraw(ethers.parseEther("0.5"), accounts[i].address);
                    const transactionReceipt = await transactionResponse.wait(1);
                    gasCost += (transactionReceipt.gasPrice * transactionReceipt.gasUsed);
                }
                const finalBalDeployer = await ethers.provider.getBalance(deployer);
                assert.equal(startBalDeployer + ethers.parseEther("2"), finalBalDeployer + gasCost);
            })

            it("checks for owner", async () => {
                const accounts = await ethers.getSigners();
                const newFundMe = await fundMe.connect(accounts[1]);
                await newFundMe.fund({ value: val });
                await expect(newFundMe.withdraw(ethers.parseEther("1"), accounts[1].address)).to.be.revertedWithCustomError({ interface: newFundMe.interface }, "NotOwner")
            })

        })

        describe("fallback", () => {
            it("checks for fallBack function", async () => {
                const accounts = await ethers.getSigners();
                await expect(accounts[1].sendTransaction({ to: fundMeAddress, value: ethers.parseEther("0") })).to.be.revertedWith("Put more, Bro")
            })
        })
    })
