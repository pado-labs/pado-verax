const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(
        "upgrade contracts with the account:",
        deployer.address
    );

    const padoPortalAddress = "0xfF1c83F2EcDC47755b75c9ff0CD40b26dBc1A41F"; // linea testnet
    //const padoPortalAddress = ""; // linea mainnet
    console.log("Upgrading PadoPortal, with proxy at", padoPortalAddress);
    const padoPortal = await ethers.getContractFactory("PADOPortalUpgradeable");
    await hre.upgrades.upgradeProxy(padoPortalAddress, padoPortal);
    console.log(`PadoPortal successfully upgraded!`);
    console.log(`PadoPortal Proxy is at ${padoPortalAddress}`);

    const padoportalImplementationAddress = await hre.upgrades.erc1967.getImplementationAddress(padoPortalAddress);
    console.log(`Implementation is at ${padoportalImplementationAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
