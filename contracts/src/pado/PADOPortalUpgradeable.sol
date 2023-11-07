// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { EIP712Upgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/cryptography/EIP712Upgradeable.sol";
import { ECDSAUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/utils/cryptography/ECDSAUpgradeable.sol";
import { OwnableUpgradeable } from "openzeppelin-contracts-upgradeable/contracts/access/OwnableUpgradeable.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import { IPortal } from "../interface/IPortal.sol";
import { AttestationPayload, Attestation } from "../types/Structs.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { IRouter } from "../interface/IRouter.sol";

contract PADOPortalUpgradeable is IPortal, EIP712Upgradeable, OwnableUpgradeable {
    struct AttestationRequestData {
        address recipient;
        uint64 expirationTime;
        bool revocable;
        bytes32 refUID;
        bytes data;
        uint256 value;
    }

    struct EIP712Signature {
        uint8 v; // The recovery ID.
        bytes32 r; // The x-coordinate of the nonce R.
        bytes32 s; // The signature data.
    }

    struct DelegatedProxyAttestationRequest {
        bytes32 schema; // The unique identifier of the schema.
        AttestationRequestData data; // The arguments of the attestation request.
        EIP712Signature signature; // The EIP712 signature data.
        address attester; // The attesting account.
        uint64 deadline; // The deadline of the signature/request.
    }

    error DeadlineExpired();
    error UsedSignature();
    error InvalidSignature();
    error AccessDenied();
    error NoRevocation();
    error NoBulkRevocation();
    error WrongMethod();

    address[] private _modules;
    ModuleRegistry public moduleRegistry;
    AttestationRegistry public attestationRegistry;
    IRouter public router;
    uint64 constant NO_EXPIRATION_TIME = 0;
    string public constant VERSION = "0.1";
    // keccak256("Attest(bytes32 schema,address recipient,uint64 expirationTime,bool revocable,bytes32 refUID,bytes data,uint64 deadline)").
    bytes32 private constant ATTEST_PROXY_TYPEHASH = 0x4120d3b28306666b714826ad7cb70744d9658ad3e6cd873411bedadcf55afda7;

    string private _name;
    uint256 private _fee;
    address payable private _receiveAddr;
    mapping(address => mapping(bytes32 schemaid => bytes32[])) private _padoAttestations;
    bytes32 private _webSchemaId;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(string memory name, uint256 feeParams, address payable recvAddr, 
    address[] memory modules, address routerParam, bytes32 webSchemaId) external initializer {
        __EIP712_init(name, VERSION);
        __Ownable_init();
        _name = name;
        _fee = feeParams;
        _receiveAddr = recvAddr;
        _modules = modules;
        router = IRouter(routerParam);
        attestationRegistry = AttestationRegistry(router.getAttestationRegistry());
        moduleRegistry = ModuleRegistry(router.getModuleRegistry());
        _webSchemaId = webSchemaId;
    }

    function attest(DelegatedProxyAttestationRequest memory attestationRequest) external payable {
        _verifyAttest(attestationRequest);

        if (_fee > 0) {
            require(msg.value >= _fee, 'less than fee');
            (bool success, ) = _receiveAddr.call{value: msg.value}(new bytes(0));
            require(success, 'transfer failed');
        }

        _attest(attestationRequest);
    }

    function bulkAttest(DelegatedProxyAttestationRequest[] memory attestationsRequests) external payable {
        for (uint256 i = 0; i < attestationsRequests.length; i++) {
            _verifyAttest(attestationsRequests[i]);
        }

        if (_fee > 0) {
            require(msg.value >= _fee * attestationsRequests.length, 'less than fee');
            (bool success, ) = _receiveAddr.call{value: msg.value}(new bytes(0));
            require(success, 'transfer failed');
        }

        for (uint256 i = 0; i < attestationsRequests.length; i++) {
            _attest(attestationsRequests[i]);
        }
    }

    function supportsInterface(bytes4 interfaceID) public pure virtual override returns (bool) {
        return
        interfaceID == type(IPortal).interfaceId ||
        interfaceID == type(IERC165).interfaceId;
    }

    function getModules() external view override returns (address[] memory) {
        return _modules;
    }

    function getAttester() public view override returns (address) {
        return owner();
    }

    function getName() external view returns (string memory) {
        return _name;
    }

    function fee() public view returns(uint256) {
        return _fee;
    }

    function setFee(uint256 feeParams) public onlyOwner returns (bool) {
        _fee = feeParams;
        return true;
    }

    function receiveAddr() public view returns(address) {
        return _receiveAddr;
    }

    function setReceiveAddr(address payable recvAddr) public onlyOwner returns (bool) {
        _receiveAddr = recvAddr;
        return true;
    }

    function setWebSchemaId(bytes32 webSchemaId) public onlyOwner returns (bool) {
        _webSchemaId = webSchemaId;
        return true;
    }

    function getWebSchemaId() public view returns(bytes32) {
        return _webSchemaId;
    }

    // Return true if the user address have both binance kyc and twitter owner Linea DeFi Voyage attestations.
    function checkDeFiVoyageHumanity(address userAddress) public view returns (bool) {
        bytes32[] memory uids = _padoAttestations[userAddress][_webSchemaId];
        uint8 resultBinanceCount = 0;
        uint8 resultTwitterCount = 0;
        for (uint256 i = 0; i < uids.length; i++) {
            Attestation memory ats = attestationRegistry.getAttestation(uids[i]);
            (string memory ProofType,string memory Source,string memory Content,string memory Condition,/*bytes32 SourceUserIdHash*/,bool Result,/*uint64 Timestamp*/,/*bytes32 UserIdHash*/) = abi.decode(ats.attestationData, (string,string,string,string,bytes32,bool,uint64,bytes32));
            if (_compareStrings(ProofType, "Identity") && _compareStrings(Source, "binance")
            && _compareStrings(Content, "KYC Level(DeFiVoyage)") && _compareStrings(Condition, ">=2") && Result) {
                resultBinanceCount++;
            }
            if (_compareStrings(ProofType, "Identity") && _compareStrings(Source, "x")
            && _compareStrings(Content, "Account Ownership(DeFiVoyage)") && _compareStrings(Condition, "Verified") && Result) {
                resultTwitterCount++;
            }
            if (resultBinanceCount >= 1 && resultTwitterCount >= 1) {
                return true;
            }
        }
        return false;
    }

    /*function checkHumanity(address userAddress) public view returns (bool) {
        return false;
    }*/

    /**
     * @notice Return true if the user address have binance kyc attestations.
     */
    function checkBinanceKyc(address userAddress) public view returns (bool) {
        return checkCommon(userAddress, "Identity", "binance", "KYC Level", ">=2");
    }

    /*function checkBinanceOwner(address userAddress) public view returns (bool) {
        return false;
    }*/

    function checkTwitterOwner(address userAddress) public view returns (bool) {
        return checkCommon(userAddress, "Identity", "x", "Account Ownership", "Verified");
    }

    function checkCommon(address userAddress, string memory proofType, string memory source, string memory content, string memory condition) public view returns (bool) {
        bytes32[] memory attestationIds =  _padoAttestations[userAddress][_webSchemaId];
        for (uint256 i = 0; i < attestationIds.length; i++) {
            Attestation memory ats = attestationRegistry.getAttestation(attestationIds[i]);
            (string memory ProofType,string memory Source,string memory Content,string memory Condition,/*bytes32 SourceUserIdHash*/,bool Result,/*uint64 Timestamp*/,/*bytes32 UserIdHash*/) = abi.decode(ats.attestationData, (string,string,string,string,bytes32,bool,uint64,bytes32));
            if (_compareStrings(ProofType, proofType) && _compareStrings(Source, source)
            && _compareStrings(Content, content) && _compareStrings(Condition, condition) && Result) {
                return true;
            }
        }
        return false;
    }

    function getPadoAttestations(address user, bytes32 schema) external view returns(bytes32[] memory) {
        return _padoAttestations[user][schema];
    }

    function _attest(DelegatedProxyAttestationRequest memory attestationRequest) internal {
        bytes[] memory validationPayloads = new bytes[](0);
        AttestationPayload memory attestationPayload = AttestationPayload(
            attestationRequest.schema,
            attestationRequest.data.expirationTime,
            abi.encodePacked(attestationRequest.data.recipient),
            attestationRequest.data.data
        );

        moduleRegistry.runModules(_modules, attestationPayload, validationPayloads, msg.value);
        attestationRegistry.attest(attestationPayload, getAttester());

        uint32 attestationIdCounter = attestationRegistry.getAttestationIdCounter();
        bytes32 attestationId = bytes32(abi.encode(attestationIdCounter));
        _padoAttestations[attestationRequest.data.recipient][attestationRequest.schema].push(attestationId);
    }

    function _verifyAttest(DelegatedProxyAttestationRequest memory request) internal view {
        if (request.attester != owner()) {
            revert AccessDenied();
        }
        if (request.deadline != NO_EXPIRATION_TIME && request.deadline <= _time()) {
            revert DeadlineExpired();
        }

        AttestationRequestData memory data = request.data;
        EIP712Signature memory signature = request.signature;

        //_verifyUnusedSignature(signature);

        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    ATTEST_PROXY_TYPEHASH,
                    request.schema,
                    data.recipient,
                    data.expirationTime,
                    data.revocable,
                    data.refUID,
                    keccak256(data.data),
                    request.deadline
                )
            )
        );

        if (ECDSAUpgradeable.recover(digest, signature.v, signature.r, signature.s) != request.attester) {
            revert InvalidSignature();
        }
    }

    function _time() internal view virtual returns (uint64) {
        return uint64(block.timestamp);
    }

    function _compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(bytes(a)) == keccak256(bytes(b)));
    }
}