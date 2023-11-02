const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(
        "test contracts with the account:",
        deployer.address
    );

    const padoContractAddress = "0x515b9dd670176e68b9623926d12082d6f37786f4";
    const padoContract = await hre.ethers.getContractAt("PADOPortalUpgradeable", padoContractAddress);
    const userAddress = "0x7ab44DE0156925fe0c24482a2cDe48C465e47573";
    const schemaId = "0x84FDF5748D9AF166503472FF5DEB0CD5F61F006169424805FD5554356AC6DF10";
    const res = await padoContract.getPadoAttestations(userAddress, schemaId);
    console.log("res=", res);

    const AttestationRegistry = "0xC765F28096F6121C2F2b82D35A4346280164428b"; // linea testnet
    //const AttestationRegistry = ""; // linea mainnet
    const contract = await hre.ethers.getContractAt("AttestationRegistry", AttestationRegistry);
    const astId = "0x0000000000000000000000000000000000000000000000000000000000001236";
    const ats = await contract.getAttestation(astId);
    console.log("ats=", ats);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});