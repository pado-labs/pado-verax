const hre = require("hardhat");

async function main() {
    console.log("version is:",hre.ethers.version)

    const [deployer] = await hre.ethers.getSigners();
    const attestationRegistryContractAddress = "0x0fF4610cEdEE2009DDa83100610a10b3b5838219"
    const attestationId = "0x0000000000000000000000000000000000000000000000000000000000000003"
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );
    //schema registry
    const attestationRegistry = await hre.ethers.getContractAt("AttestationRegistry", attestationRegistryContractAddress);
    try {
        let attestation = await attestationRegistry.getAttestation(attestationId);
        let data = hre.ethers.AbiCoder.defaultAbiCoder().decode(["string","string","string","string","bytes32","bool","uint64","bytes32"],attestation.attestationData)
        data.forEach(e=>{
            console.log(e)
        })
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
