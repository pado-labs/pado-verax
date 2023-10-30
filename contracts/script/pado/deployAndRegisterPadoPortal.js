const hre = require("hardhat");
const {boolean} = require("hardhat/internal/core/params/argumentTypes");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );
    console.log("start!!!!")
    const padoPortal = await hre.ethers.getContractFactory("PADOPortal");
    const padoPortalContract = await padoPortal.deploy('PADOPortal', 60000000000000, "0x024e45D7F868C41F3723B13fD7Ae03AA5A181362", [], "0xBc64cDf29e598F7a6917ab23bAB24A815891bE71");
    console.log("Pado Portal deploy at :", padoPortalContract.target)
    //check issue
    const contract = await hre.ethers.getContractAt("PortalRegistry", '0x73d3654Ed0A308F646886516A53883dCB28DBaCB');
    let isIssuer = false;
    try {
        isIssuer = await contract.isIssuer(deployer.address)
        console.log(`address is issuer:${isIssuer}`)
        if (!isIssuer) {
            //register to PortalRegistry
            console.log("set issuer")
            contract.setIssuer(deployer.address)
            console.log("set issuer success!")
        }
        //
        console.log("register to PortalRegistry")
        await contract.register(padoPortalContract.target, "PADOPortal", "no desc", true, "PADO");
        console.log(`register PADOPortal address:${padoPortalContract.target} success!`);
    } catch (er) {
        if (er.data && contract) {
            const decodedError = contract.interface.parseError(er.data);
            console.log(`Transaction failed: ${decodedError?.name}`);
        } else {
            console.log(`Error in widthrawContract:`, er);
        }
    }


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
