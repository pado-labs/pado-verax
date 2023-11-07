const hre = require("hardhat");

async function main() {
    console.log("version is:", hre.ethers.version)

    const [deployer] = await hre.ethers.getSigners();
    const commonSchemaStr = "string ProofType,string Source,string Content,string Condition,bytes32 SourceUserIdHash,bool Result,uint64 Timestamp,bytes32 UserIdHash";
    const assetProofSchemaStr = "string source,bytes32 sourceUseridHash,bytes32 authUseridHash,address receipt,uint64 getDataTime,uint64 baseValue,bool balanceGreaterThanBaseValue";
    const tokenHoldingSchemaStr = "string source,bytes32 sourceUseridHash,bytes32 authUseridHash,address recipient,uint64 getDataTime,string asset,string baseAmount,bool balanceGreaterThanBaseAmount";
    const identityProofSchemaStr = "string source,string credentialType,bytes32 authUseridHash,address recipient,uint64 timestamp,bool result";
    const assetProofSchemaPolygonStr = "string source,bytes32 sourceUseridHash,bytes32 authUseridHash,string issuerDID,string recipientDID,address recipient,uint64 getDataTime,uint64 baseValue,bool balanceGreaterThanBaseValue";
    const tokenHoldingSchemaPolygonStr = "string source,bytes32 sourceUseridHash,bytes32 authUseridHash,string issuerDID,string recipientDID,address recipient,uint64 getDataTime,string asset,string baseAmount,bool balanceGreaterThanBaseAmount";
    const identityProofSchemaPolygonStr = "string source,string credentialType,bytes32 authUseridHash,string issuerDID,string recipientDID,address recipient,uint64 timestamp,bool result";

    const schemaMap = {
        commonSchemaStr: commonSchemaStr,
        assetProof: assetProofSchemaStr,
        assetProofPolygon: assetProofSchemaPolygonStr,
        tokenHolding: tokenHoldingSchemaStr,
        tokenHoldingPolygon: tokenHoldingSchemaPolygonStr,
        identityProof: identityProofSchemaStr,
        identityProofPolygon: identityProofSchemaPolygonStr,
    };

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );
    //schema registry
    const contract = await hre.ethers.getContractAt("SchemaRegistry",
        '0x7B9410e815C65f291dC69741A504DBA790797D43'
    );
    for (const key in schemaMap) {

        try {
            let shcemaId = await contract.getIdFromSchemaString(schemaMap[key]);
            let schemaIdIsExist = await contract.isRegistered(shcemaId)
            console.log(`${key} id is :${shcemaId}, exist: ${schemaIdIsExist}`)
            if (!schemaIdIsExist) {
                console.log("start to createSchema!")
                //if not exists, start createSchema
                let createSchemaTransactionResponse = await contract.createSchema(key, "PADO_SCHEMA", "https://padolabs.org", schemaMap[key]);
                console.log(` ${key} please check schemaUID at tx Hash: ${createSchemaTransactionResponse.hash}`)
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

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
