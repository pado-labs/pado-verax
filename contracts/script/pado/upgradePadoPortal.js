const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(
        "upgrade contracts with the account:",
        deployer.address
    );

    const padoPortalAddress = "0x515b9dd670176e68b9623926d12082d6f37786f4"; // linea testnet
    //const padoPortalAddress = ""; // linea mainnet
    console.log("Upgrading PadoPortal, with proxy at", padoPortalAddress);
    const padoPortal = await hre.ethers.getContractFactory("PADOPortalUpgradeable");
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
