const hre = require("hardhat");

const scrollPadoPortalAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "feeParams",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "recvAddr",
                "type": "address"
            },
            {
                "internalType": "address[]",
                "name": "modules",
                "type": "address[]"
            },
            {
                "internalType": "address",
                "name": "router",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AccessDenied",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "DeadlineExpired",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidShortString",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidSignature",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NoBulkRevocation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NoRevocation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OnlyPortalOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "str",
                "type": "string"
            }
        ],
        "name": "StringTooLong",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UsedSignature",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "WrongMethod",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "EIP712DomainChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "VERSION",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "schemaId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "expirationDate",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes",
                        "name": "subject",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "attestationData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct AttestationPayload",
                "name": "attestationPayload",
                "type": "tuple"
            },
            {
                "internalType": "bytes[]",
                "name": "validationPayloads",
                "type": "bytes[]"
            }
        ],
        "name": "attest",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "schema",
                        "type": "bytes32"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "recipient",
                                "type": "address"
                            },
                            {
                                "internalType": "uint64",
                                "name": "expirationTime",
                                "type": "uint64"
                            },
                            {
                                "internalType": "bool",
                                "name": "revocable",
                                "type": "bool"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "refUID",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes",
                                "name": "data",
                                "type": "bytes"
                            },
                            {
                                "internalType": "uint256",
                                "name": "value",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct PADOPortal.AttestationRequestData",
                        "name": "data",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct PADOPortal.EIP712Signature",
                        "name": "signature",
                        "type": "tuple"
                    },
                    {
                        "internalType": "address",
                        "name": "attester",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "deadline",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct PADOPortal.DelegatedProxyAttestationRequest",
                "name": "attestationRequest",
                "type": "tuple"
            }
        ],
        "name": "attest",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "attestationRegistry",
        "outputs": [
            {
                "internalType": "contract AttestationRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "schema",
                        "type": "bytes32"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "recipient",
                                "type": "address"
                            },
                            {
                                "internalType": "uint64",
                                "name": "expirationTime",
                                "type": "uint64"
                            },
                            {
                                "internalType": "bool",
                                "name": "revocable",
                                "type": "bool"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "refUID",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes",
                                "name": "data",
                                "type": "bytes"
                            },
                            {
                                "internalType": "uint256",
                                "name": "value",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct PADOPortal.AttestationRequestData",
                        "name": "data",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint8",
                                "name": "v",
                                "type": "uint8"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "r",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "s",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct PADOPortal.EIP712Signature",
                        "name": "signature",
                        "type": "tuple"
                    },
                    {
                        "internalType": "address",
                        "name": "attester",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "deadline",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct PADOPortal.DelegatedProxyAttestationRequest[]",
                "name": "attestationsRequests",
                "type": "tuple[]"
            }
        ],
        "name": "bulkAttest",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "schemaId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "expirationDate",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes",
                        "name": "subject",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "attestationData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct AttestationPayload[]",
                "name": "attestationsPayloads",
                "type": "tuple[]"
            },
            {
                "internalType": "bytes[][]",
                "name": "validationPayloads",
                "type": "bytes[][]"
            }
        ],
        "name": "bulkAttest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32[]",
                "name": "attestationIds",
                "type": "bytes32[]"
            },
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "schemaId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "expirationDate",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes",
                        "name": "subject",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "attestationData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct AttestationPayload[]",
                "name": "attestationsPayloads",
                "type": "tuple[]"
            },
            {
                "internalType": "bytes[][]",
                "name": "validationPayloads",
                "type": "bytes[][]"
            }
        ],
        "name": "bulkReplace",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32[]",
                "name": "attestationIds",
                "type": "bytes32[]"
            }
        ],
        "name": "bulkRevoke",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "eip712Domain",
        "outputs": [
            {
                "internalType": "bytes1",
                "name": "fields",
                "type": "bytes1"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "version",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "verifyingContract",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "salt",
                "type": "bytes32"
            },
            {
                "internalType": "uint256[]",
                "name": "extensions",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fee",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAttester",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getModules",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "moduleRegistry",
        "outputs": [
            {
                "internalType": "contract ModuleRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "modules",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "portalRegistry",
        "outputs": [
            {
                "internalType": "contract PortalRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "receiveAddr",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "attestationId",
                "type": "bytes32"
            },
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "schemaId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "expirationDate",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes",
                        "name": "subject",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "attestationData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct AttestationPayload",
                "name": "attestationPayload",
                "type": "tuple"
            },
            {
                "internalType": "bytes[]",
                "name": "validationPayloads",
                "type": "bytes[]"
            }
        ],
        "name": "replace",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "attestationId",
                "type": "bytes32"
            }
        ],
        "name": "revoke",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "router",
        "outputs": [
            {
                "internalType": "contract IRouter",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "feeParams",
                "type": "uint256"
            }
        ],
        "name": "setFee",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "recvAddr",
                "type": "address"
            }
        ],
        "name": "setReceiveAddr",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceID",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

async function main() {
    console.log("version is:",hre.ethers.version)
    const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

    const [deployer] = await hre.ethers.getSigners();
    const padoPortalContractAddress = "0x140Af5BC161060Ccdb8fDAC32Ad0e35Cefd2F44f";
    const schemaUid = "0xea3441099f6764cd494e7076d797b439aaf88f0693608a0557e389dfebcff8e9";
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );
    const contract = new hre.ethers.Contract(
        padoPortalContractAddress,
        scrollPadoPortalAbi,
        deployer
    );
    const splitsignature = hre.ethers.Signature.from("0x668ecf8597b65b0385e9c2b4f43ee5d38ae06a6d6876bc18ecc3eb52267dccab24f867485217051f5102b1bd6e3b3ed0428a0d0862100b1346199aa25bcf224f1b");
    const formatSignature = {
        v: splitsignature.v,
        r: splitsignature.r,
        s: splitsignature.s,
    };
    const paramsobj = {
        schema: schemaUid,
        data: {
            recipient: "0x024e45d7f868c41f3723b13fd7ae03aa5a181362",
            expirationTime: 0,
            revocable: true,
            refUID: ZERO_BYTES32,
            data: "0x00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000018000000000000000000000000000000000000000000000000000000000000001c092b2aeefe25f0c630bec9976d5d9ee8286440ad91a6a8d67d57c5588954b2eea00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000018b7fc7dfc861be007db980d6fdc503b5aee5bf5543ccbb8548a4aad3b4b0ef1b1ba1e9363800000000000000000000000000000000000000000000000000000000000000084964656e74697479000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000762696e616e63650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000094b5943204c6576656c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033e3d320000000000000000000000000000000000000000000000000000000000",
            value: 0n,
        },
        signature: formatSignature,
        attester: "0x024e45D7F868C41F3723B13fD7Ae03AA5A181362",
        deadline: 0,
    };
    try {
        let tx = await contract["attest((bytes32,(address,uint64,bool,bytes32,bytes,uint256),(uint8,bytes32,bytes32),address,uint64))"](paramsobj,{ value: 60000000000000 });
        console.log(`please see atestationId at hash: ${tx.hash}`)
    }catch (er) {
        if (er.data && contract) {
            const decodedError = contract.interface.parseError(er.data);
            console.log(`Transaction failed: ${decodedError?.name}`);
        } else {
            console.log(`Error while send request:`, er);
        }
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
