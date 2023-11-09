const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(
        "test contracts with the account:",
        deployer.address
    );

    const padoContractAddress = "0x8A047d2FbcEC425D7A28de7bce3630f38eC497c6"; // scroll sepolia testnet
    //const padoContractAddress = "0x1A58B9E0Aae7990466eA70d6791876EDcab67Ea7"; // scroll mainnet
    const padoContract = await hre.ethers.getContractAt("PADOPortalUpgradeable", padoContractAddress);
    const userAddress = "0x7ab44DE0156925fe0c24482a2cDe48C465e47573";
    const schemaId = "0x84FDF5748D9AF166503472FF5DEB0CD5F61F006169424805FD5554356AC6DF10";
    const res = await padoContract.getPadoAttestations(userAddress, schemaId);
    console.log("res=", res);

    let resWebScheme = await padoContract.getWebSchemaId();
    console.log("resWebScheme=", resWebScheme);
    /*const resSet = await padoContract.setWebSchemaId(schemaId);
    console.log("resSet=", resSet);*/
    let resCheck = await padoContract.checkBinanceKyc(userAddress);
    console.log("resCheck=", resCheck);
    let resCheck1 = await padoContract.checkScrollBinanceOwner(userAddress);
    console.log("resCheck1=", resCheck1);
    let resCheck2 = await padoContract.checkScrollTwitterOwner(userAddress);
    console.log("resCheck2=", resCheck2);

    //const AttestationRegistry = "0xC765F28096F6121C2F2b82D35A4346280164428b"; // linea testnet
    //const AttestationRegistry = ""; // linea mainnet
    const AttestationRegistry = "0x0fF4610cEdEE2009DDa83100610a10b3b5838219"; // scroll sepolia testnet
    const contract = await hre.ethers.getContractAt("AttestationRegistry", AttestationRegistry);
    const astId = "0x0000000000000000000000000000000000000000000000000000000000000019";
    const ats = await contract.getAttestation(astId);
    console.log("ats=", ats);
    const decodedata = hre.ethers.AbiCoder.defaultAbiCoder().decode(
        ['string','string','string','string','bytes32','bool','uint64','bytes32'],
        ats[11]
    );
    console.log("decodedata=", decodedata);
    const astId1 = "0x000000000000000000000000000000000000000000000000000000000000001d";
    const ats1 = await contract.getAttestation(astId1);
    console.log("ats1=", ats1);
    const decodedata1 = hre.ethers.AbiCoder.defaultAbiCoder().decode(
        ['string','string','string','string','bytes32','bool','uint64','bytes32'],
        ats1[11]
    );
    console.log("decodedata1=", decodedata1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
