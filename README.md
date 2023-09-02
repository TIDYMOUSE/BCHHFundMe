# SETUP : 
```shell
npm i yarn
yarn add hardhat
yarn add --dev @nomiclabs/hardhat-solhint
yarn add --dev @chainlink/contracts
yarn add --dev hardhat-deploy
yarn add --dev  @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
yarn add --dev solidity-coverage
yarn add --dev dotenv
```


# NOTES : 
1) you have to add following code in hardhat.config.js when using getNamedAccounts();
```JSON
namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
    },
},
```

2) Please keep sol filenames initialized with capital letter. (error thrown in deploy() in 01-deploy-fundMe.js)
3) There are two ways to get a contract : 
    1) contract factory method : 
```js
const contractFact = await ethers.getContractFactory("contractName");
const contract = await contractFact.deploy()
await contract.waitForDeployment(); // optional 
```

    2) .getContract() : 
```js
await deployments.fixture(["ur tags from ur deploy scripts"]);
let contract = await deployments.get("ContractName");
contract = await ethers.getContractAt("ContractName", contract.address);
```
3) When eth value is going to be returned , remember to use .toString()

4) <B> ALL VARIABLES OF A CONTRACT ARE FUNCTIONS IN SCRIPTS </B>

5) use .add() on bigNumbers

6) use a transactionResponse and Receipt for withdraw


# NEW : 
1) 
```js
let oneEth = ethers.utils.parseEther("1");
```
2) two methods to send money through scripts using signers/providers(ContractRunner): 
```js
// from existing myContract 
const [owner, myAdd] = await ethers.getSigners() // 0 is owner.. think abt it
const newContract = await myContract.connect(myAdd.address)
// newContract is like calling myContract from an different address such that owner remains same as original ( newContract.owner() != myAdd.address but newContract.runner == myAdd.address)
```
```js
// using signer.sendTransaction
const [owner, myAdd] = await ethers.getSigners()
const transactionResponse = await myAdd.sendTransaction({
    to: contract.address, // or (await deployments.get("contract")).deployer
    value: ethers.parseEther("1")
    })
const transactionReceipt = await transactionResponse.wait(1);

```


