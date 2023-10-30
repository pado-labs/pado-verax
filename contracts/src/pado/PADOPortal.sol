// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import { EIP712 } from "openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol";
import { ECDSA } from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import { Ownable } from "openzeppelin-contracts/contracts/access/Ownable.sol";
import { IERC165 } from "openzeppelin-contracts/contracts/utils/introspection/ERC165.sol";
import { IPortal } from "../interface/IPortal.sol";
import { AttestationPayload } from "../types/Structs.sol";
import { ModuleRegistry } from "../ModuleRegistry.sol";
import { AttestationRegistry } from "../AttestationRegistry.sol";
import { IRouter } from "../interface/IRouter.sol";


contract PADOPortal is IPortal, EIP712, Ownable {
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

    constructor(string memory name, uint256 feeParams, address payable recvAddr,address[] memory modules, address routerParam) EIP712(name, VERSION) {
        _modules = modules;
        router = IRouter(routerParam);
        attestationRegistry = AttestationRegistry(router.getAttestationRegistry());
        moduleRegistry = ModuleRegistry(router.getModuleRegistry());
        _name = name;
        _fee = feeParams;
        _receiveAddr = recvAddr;
    }

    function attest(DelegatedProxyAttestationRequest memory attestationRequest) external payable {
        _verifyAttest(attestationRequest);

        if (_fee > 0) {
            require(msg.value >= _fee, 'less than fee');
            (bool success, ) = _receiveAddr.call{value: msg.value}(new bytes(0));
            require(success, 'transfer failed');
        }

        bytes[] memory validationPayloads = new bytes[](0);
        AttestationPayload memory attestationPayload = AttestationPayload(
            attestationRequest.schema,
            attestationRequest.data.expirationTime,
            abi.encodePacked(attestationRequest.data.recipient),
            attestationRequest.data.data
        );

        moduleRegistry.runModules(_modules, attestationPayload, validationPayloads, msg.value);
        attestationRegistry.attest(attestationPayload, getAttester());
    }

    function bulkAttest(DelegatedProxyAttestationRequest[] memory attestationsRequests) external  payable{
        for (uint256 i = 0; i < attestationsRequests.length; i++) {
            _verifyAttest(attestationsRequests[i]);
        }

        if (_fee > 0) {
            require(msg.value >= _fee * attestationsRequests.length, 'less than fee');
            (bool success, ) = _receiveAddr.call{value: msg.value}(new bytes(0));
            require(success, 'transfer failed');
        }

        AttestationPayload[] memory attestationsPayloads = new AttestationPayload[](attestationsRequests.length);
        bytes[][] memory validationPayloads = new bytes[][](attestationsRequests.length);
        for (uint256 i = 0; i < attestationsRequests.length; i++) {
            attestationsPayloads[i] = AttestationPayload(
                attestationsRequests[i].schema,
                attestationsRequests[i].data.expirationTime,
                abi.encodePacked(attestationsRequests[i].data.recipient),
                attestationsRequests[i].data.data
            );

            validationPayloads[i] = new bytes[](0);
        }

        moduleRegistry.bulkRunModules(_modules, attestationsPayloads, validationPayloads);
        attestationRegistry.bulkAttest(attestationsPayloads, getAttester());
    }

    function supportsInterface(bytes4 interfaceID) public pure virtual override returns (bool) {
        return
        interfaceID == type(IPortal).interfaceId ||
        interfaceID == type(IERC165).interfaceId;
    }

    function getModules() external view returns (address[] memory) {
        return _modules;
    }

    function getAttester() public view virtual returns (address) {
        return owner();
    }

    function getName() external view returns (string memory) {
        return _name;
    }

    function fee() public view returns(uint256) {
        return _fee;
    }

    function setFee(uint256 feeParams) public onlyOwner returns (bool){
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

        if (ECDSA.recover(digest, signature.v, signature.r, signature.s) != request.attester) {
            revert InvalidSignature();
        }
    }

    function _time() internal view virtual returns (uint64) {
        return uint64(block.timestamp);
    }
}