const hre = require("hardhat");

//If the contract is not deployed in the current environment, you need to execute this script to write the contract information to the configuration file
//ref: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#force-import
async function main() {
    const attestationRegistry = await hre.ethers.getContractFactory("PADOPortalUpgradeable");
    await hre.upgrades.forceImport("0x515b9dd670176e68b9623926d12082d6f37786f4",attestationRegistry,{ 'kind': 'transparent' })
}
main()