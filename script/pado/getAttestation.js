const hre = require("hardhat");

async function main() {
    console.log("version is:",hre.ethers.version)

    const [deployer] = await hre.ethers.getSigners();
    const attestationRegistryContractAddress = "0xC765F28096F6121C2F2b82D35A4346280164428b"
    const attestationId = "0x00000000000000000000000000000000000000000000000000000000000017a3"
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );
    //schema registry
    const attestationRegistry = await hre.ethers.getContractAt("AttestationRegistry", attestationRegistryContractAddress);
    try {
        let attestation = await attestationRegistry.getAttestation(attestationId);
        console.log(`--------------`)
        console.log(`revoke:${attestation.revoked}`)
        console.log(`--------------`)
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
