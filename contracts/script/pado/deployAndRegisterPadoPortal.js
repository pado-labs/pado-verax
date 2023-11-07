const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Deploying PADOPortalUpgradeable...");
    const fee = "300000000000000";
    const receiveAddr = "0x024e45D7F868C41F3723B13fD7Ae03AA5A181362";
    const RouterAddress = "0xBc64cDf29e598F7a6917ab23bAB24A815891bE71"; // linea testnet
    //const RouterAddress = "0x4d3a380A03f3a18A5dC44b01119839D8674a552E"; // linea mainnet
    const padoportalcontract = await hre.ethers.getContractFactory("PADOPortalUpgradeable");
    const padoportal = await hre.upgrades.deployProxy(padoportalcontract,
        ["PADO Portal", fee, receiveAddr, [], RouterAddress,"0xea3441099f6764cd494e7076d797b439aaf88f0693608a0557e389dfebcff8e9"], {initializer: 'initialize'});
    await padoportal.waitForDeployment();
    const padoportalProxyAddress = await padoportal.getAddress();
    const padoportalImplementationAddress = await hre.upgrades.erc1967.getImplementationAddress(padoportalProxyAddress);
    const adminAddress = await hre.upgrades.erc1967.getAdminAddress(padoportalProxyAddress);
    //await hre.run("verify:verify", {
    //  address: easproxyProxyAddress,
    //});
    console.log(`Proxy is at ${padoportalProxyAddress}`);
    console.log(`Implementation is at ${padoportalImplementationAddress}`);
    console.log(`adminAddress is at ${adminAddress}`);

    const PortalRegistry = "0x73d3654Ed0A308F646886516A53883dCB28DBaCB"; // linea testnet
    //const PortalRegistry = "0xd5d61e4ECDf6d46A63BfdC262af92544DFc19083"; // linea mainnet
    const contract = await hre.ethers.getContractAt("PortalRegistry", PortalRegistry);
    try {
        await contract.register(padoportalProxyAddress, "PADO Portal", "Portal of PADO", true, "PADO Labs");
        console.log(`register PADOPortal address:${padoportalProxyAddress} success!`);
    } catch (er) {
        if (er.data && contract) {
            const decodedError = contract.interface.parseError(er.data);
            console.log(`Transaction failed: ${decodedError?.name}`);
        } else {
            console.log(`Error register:`, er);
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
