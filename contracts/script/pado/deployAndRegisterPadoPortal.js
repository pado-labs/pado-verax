const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Deploying PADOPortalUpgradeable...");
    const fee = "300000000000000";
    const receiveAddr = "0x9717BdADb90a18e040e835b665f9E51eAa101ab1";
    //const RouterAddress = "0x736c78b2f2cBf4F921E8551b2acB6A5Edc9177D5"; // linea testnet
    //const RouterAddress = "0x4d3a380A03f3a18A5dC44b01119839D8674a552E"; // linea mainnet
    //const RouterAddress = "0xBc64cDf29e598F7a6917ab23bAB24A815891bE71"; // scroll testnet
    const RouterAddress = "0x3760aB354507a29a9F5c65A66C74353fd86393FA"; // scroll mainnet
    //const WebSchemaId = ""; // linea testnet
    //const WebSchemaId = "0x4d3a380A03f3a18A5dC44b01119839D8674a552E"; // linea mainnet
    //const WebSchemaId = "0xea3441099f6764cd494e7076d797b439aaf88f0693608a0557e389dfebcff8e9"; // scroll testnet
    const WebSchemaId = "0x84fdf5748d9af166503472ff5deb0cd5f61f006169424805fd5554356ac6df10"; // scroll mainnet
    const padoportalcontract = await hre.ethers.getContractFactory("PADOPortalUpgradeable");
    const padoportal = await hre.upgrades.deployProxy(padoportalcontract,
        ["PADO Portal", fee, receiveAddr, [], RouterAddress, WebSchemaId], {initializer: 'initialize'});
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

    //const PortalRegistry = "0x73d3654Ed0A308F646886516A53883dCB28DBaCB"; // linea testnet
    //const PortalRegistry = "0xd5d61e4ECDf6d46A63BfdC262af92544DFc19083"; // linea mainnet
    //const PortalRegistry = ""; // scroll testnet
    const PortalRegistry = "0x3CF341692deAD89AD0e98141B768eF3Ad89CDCa7"; // scroll mainnet
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
