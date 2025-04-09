// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Groth16Verifier} from "./ZkVaultBasicVerifier.sol";

contract ZkVaultBasic is ReentrancyGuard {
    IVerifier private _verifier;
    uint256 private _denomination;
    mapping(bytes32 => bool) private _commitments;

    event Deposit(bytes32 indexed commitment, uint256 timestamp);
    event Withdraw(
        bytes32 indexed commitment,
        address indexed recipient,
        uint256 timestamp
    );

    constructor(IVerifier verifier, uint256 aDenomination) {
        _verifier = verifier;
        _denomination = aDenomination;
    }

    function denomination() external view returns (uint256) {
        return _denomination;
    }

    function deposit(bytes32 commitment) external payable nonReentrant {
        require(msg.value == _denomination, "Invalid deposit amount");

        require(!_commitments[commitment], "Commitment already used");

        _commitments[commitment] = true;

        emit Deposit(commitment, block.timestamp);
    }

    function withdraw(
        uint[2] calldata pA,
        uint[2][2] calldata pB,
        uint[2] calldata pC,
        uint[4] calldata pubSignals
    ) external nonReentrant {
        bytes32 commitment = bytes32(pubSignals[0]);
        require(_commitments[commitment], "Commitment already spent");

        address recipient = address(uint160(pubSignals[1]));

        bool valid = _verifier.verifyProof(pA, pB, pC, pubSignals);
        require(valid, "Invalid proof");

        _commitments[commitment] = false;

        (bool sent, ) = recipient.call{value: _denomination}("");
        require(sent, "ETH transfer failed");

        emit Withdraw(commitment, recipient, block.timestamp);
    }

    receive() external payable {
        revert("Use deposit function");
    }
}

interface IVerifier {
    function verifyProof(
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[4] calldata _pubSignals
    ) external view returns (bool);
}
