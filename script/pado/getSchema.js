const hre = require("hardhat");

async function main() {
    console.log("version is:", hre.ethers.version)

    const [deployer] = await hre.ethers.getSigners();
    const commonSchemaStr = "string ProofType,string Source,string Content,string Condition,bytes32 SourceUserIdHash,bool Result,uint64 Timestamp,bytes32 UserIdHash";
    const assetProofSchemaStr = "string source,bytes32 sourceUseridHash,bytes32 authUseridHash,address receipt,uint64 getDataTime,uint64 baseValue,bool balanceGreaterThanBaseValue";
    const tokenHoldingSchemaStr = "string source,bytes32 sourceUseridHash,bytes32 authUseridHash,address recipient,uint64 getDataTime,string asset,string baseAmount,bool balanceGreaterThanBaseAmount";
    const identityProofSchemaStr  = "string source,string credentialType,bytes32 authUseridHash,address recipient,uint64 timestamp,bool result";
    const assetProofSchemaPolygonStr = "string source,bytes32 sourceUseridHash,bytes32 authUseridHash,string issuerDID,string recipientDID,address recipient,uint64 getDataTime,uint64 baseValue,bool balanceGreaterThanBaseValue";
    const tokenHoldingSchemaPolygonStr = "string source,bytes32 sourceUseridHash,bytes32 authUseridHash,string issuerDID,string recipientDID,address recipient,uint64 getDataTime,string asset,string baseAmount,bool balanceGreaterThanBaseAmount";
    const identityProofSchemaPolygonStr = "string source,string credentialType,bytes32 authUseridHash,string issuerDID,string recipientDID,address recipient,uint64 timestamp,bool result";

    console.log(
        "Operation with the account:",
        deployer.address
    );
    //schema registry
    const contract = await hre.ethers.getContractAt("SchemaRegistry",
        '0xB2c4Da1f8F08A0CA25862509E5431289BE2b598B'
    );
    try {
        let schema = await contract.getSchema("0x84FDF5748D9AF166503472FF5DEB0CD5F61F006169424805FD5554356AC6DF10");
        console.log(schema)
    } catch (er) {
        if (er.data && contract) {
            const decodedError = contract.interface.parseError(er.data);
            console.log(`Transaction failed: ${decodedError?.name}`);
        } else {
            console.log(`Error in request:`, er);
        }
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
