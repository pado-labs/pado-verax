const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(
        "test contracts with the account:",
        deployer.address
    );

    //const padoContractAddress = "0x8A047d2FbcEC425D7A28de7bce3630f38eC497c6"; // scroll sepolia testnet
    //const padoContractAddress = "0x1A58B9E0Aae7990466eA70d6791876EDcab67Ea7"; // scroll mainnet
    //const padoContractAddress = "0x515b9dd670176e68b9623926d12082d6f37786f4"; // linea goerli testnet
    const padoContractAddress = "0xc4B7dCba12866f6f8181b949ca443232C4e94334"; // linea mainnet
    const padoContract = await hre.ethers.getContractAt("PADOPortalUpgradeable", padoContractAddress);
    const userAddress = "0xDB736B13E2f522dBE18B2015d0291E4b193D8eF6";
    const schemaId = "0x84FDF5748D9AF166503472FF5DEB0CD5F61F006169424805FD5554356AC6DF10";
    //const res = await padoContract.getPadoAttestations(userAddress, schemaId);
    //console.log("res=", res);

    let res = await padoContract.checkDeFiVoyageHumanityWithTwitter(userAddress);
    console.log("res=", res);
    let res1 = await padoContract.checkDeFiVoyageHumanity(userAddress);
    console.log("res1=", res1);
    let res2 = await padoContract.fee();
    console.log("res2=", res2);
    let res3 = await padoContract.receiveAddr();
    console.log("res3=", res3);
    let resschemaid = await padoContract.getWebSchemaId();
    console.log("resschemaid=", resschemaid);

    //let resSetModuleRegistry = await padoContract.setModuleRegistry("0x50bd377EB8D4236Bb587AB3FB1eeafd888AEeC58");
    //console.log("resSetModuleRegistry=", resSetModuleRegistry);

    // let resModuleRegistry = await padoContract.moduleRegistry();
    // console.log("resModuleRegistry=", resModuleRegistry);
    // let resAttestationRegistry = await padoContract.attestationRegistry();
    // console.log("resAttestationRegistry=", resAttestationRegistry);
    /*const resSet = await padoContract.setWebSchemaId(schemaId);
    console.log("resSet=", resSet);*/
    // let resCheck = await padoContract.checkBinanceKyc(userAddress);
    // console.log("resCheck=", resCheck);
    // let resCheck1 = await padoContract.checkScrollBinanceOwner(userAddress);
    // console.log("resCheck1=", resCheck1);
    // let resCheck2 = await padoContract.checkScrollTwitterOwner(userAddress);
    // console.log("resCheck2=", resCheck2);

    //const AttestationRegistry = "0xC765F28096F6121C2F2b82D35A4346280164428b"; // linea testnet
    const AttestationRegistry = "0x3de3893aa4Cdea029e84e75223a152FD08315138"; // linea mainnet
    //const AttestationRegistry = "0xC769999Dd0abBB7007F6F9aF58aA17F4C45aa3bA"; // scroll sepolia testnet
    const contract = await hre.ethers.getContractAt("AttestationRegistry", AttestationRegistry);
    const astId = "0x000000000000000000000000000000000000000000000000000000000003e573";
    const ats = await contract.getAttestation(astId);
    console.log("ats=", ats);
    const decodedata = hre.ethers.AbiCoder.defaultAbiCoder().decode(
        ['string','string','string','string','bytes32','bool','uint64','bytes32'],
        ats[11]
    );
    console.log("decodedata=", decodedata);
    /*const astId1 = "0x0000000000000000000000000000000000000000000000000000000000000002";
    const ats1 = await contract.getAttestation(astId1);
    console.log("ats1=", ats1);
    const decodedata1 = hre.ethers.AbiCoder.defaultAbiCoder().decode(
        ['string','string','string','string','bytes32','bool','uint64','bytes32'],
        ats1[11]
    );
    console.log("decodedata1=", decodedata1);*/
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
