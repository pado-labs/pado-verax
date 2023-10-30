const hre = require("hardhat");

async function main() {
    console.log("version is:", hre.ethers.version)

    const [deployer] = await hre.ethers.getSigners();
    const schemaStr = "string proofType2, string source, string content, string condition, bytes32 sourceUseridHash, bool result, uint64 timestamp, bytes32 useridHash";
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );
    //schema registry
    const contract = await hre.ethers.getContractAt("SchemaRegistry",
        '0x7B9410e815C65f291dC69741A504DBA790797D43'
    );
    try {
        let shcemaId = await contract.getIdFromSchemaString(schemaStr);
        let schemaIdIsExist = await contract.isRegistered(shcemaId)
        console.log(`schema id is :${shcemaId}, exist: ${schemaIdIsExist}`)
        if(!schemaIdIsExist){
            console.log("start to createSchema!")
            //if not exists, start createSchema
            let createSchemaTransactionResponse = await contract.createSchema("common-schema","no desc","no-url",schemaStr);
            console.log(`please check schemaUID at tx Hash: ${createSchemaTransactionResponse.hash}`)
        }

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
