const hre = require("hardhat");

async function main() {
    console.log("version is:",hre.ethers.version)

    const [deployer] = await hre.ethers.getSigners();
    const attestationRegistryContractAddress = "0x515b9dd670176e68b9623926d12082d6f37786f4"
    const padoSchemaId = "0x84FDF5748D9AF166503472FF5DEB0CD5F61F006169424805FD5554356AC6DF10"
    const userAddress = "0x024e45D7F868C41F3723B13fD7Ae03AA5A181362"


    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );
    //schema registry
    const attestationRegistry = await hre.ethers.getContractAt("PADOPortalUpgradeable", attestationRegistryContractAddress);
    try {
        let attestation = await attestationRegistry.getPadoAttestations(userAddress,padoSchemaId);
        console.log(attestation)
    }catch (er) {
        if (er.data && attestationRegistry) {
            const decodedError = attestationRegistry.interface.parseError(er.data);
            console.log(`Transaction failed: ${decodedError?.name}`);
        } else {
            console.log(`Error in portalRegistry:`, er);
        }
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
