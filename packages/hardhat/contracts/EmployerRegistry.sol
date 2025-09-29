// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title EmployerRegistry - Verification registry for gig providers on Meritbase
contract EmployerRegistry is Ownable {
    enum VerificationStatus {
        Unregistered,
        Pending,
        Approved,
        Rejected
    }

    struct Employer {
        address wallet;
        string companyName;
        string contactEmail;
        string licenseCid; // IPFS CID for uploaded company license or certificate
        VerificationStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(address => Employer) private employers;

    event EmployerRegistered(address indexed wallet, string companyName, string licenseCid);
    event EmployerUpdated(address indexed wallet, string companyName, string licenseCid);
    event EmployerVerificationChanged(address indexed wallet, VerificationStatus status);

    error EmployerAlreadyRegistered();
    error EmployerNotRegistered();
    error InvalidMetadata();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function registerEmployer(
        string calldata companyName,
        string calldata contactEmail,
        string calldata licenseCid
    ) external {
        Employer storage existing = employers[msg.sender];
        if (existing.status != VerificationStatus.Unregistered) {
            revert EmployerAlreadyRegistered();
        }
        if (bytes(companyName).length == 0 || bytes(licenseCid).length == 0) {
            revert InvalidMetadata();
        }

        employers[msg.sender] = Employer({
            wallet: msg.sender,
            companyName: companyName,
            contactEmail: contactEmail,
            licenseCid: licenseCid,
            status: VerificationStatus.Pending,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        emit EmployerRegistered(msg.sender, companyName, licenseCid);
        emit EmployerVerificationChanged(msg.sender, VerificationStatus.Pending);
    }

    function updateEmployer(
        string calldata companyName,
        string calldata licenseCid
    ) external {
        Employer storage existing = employers[msg.sender];
        if (existing.status == VerificationStatus.Unregistered) {
            revert EmployerNotRegistered();
        }
        if (bytes(companyName).length == 0 || bytes(licenseCid).length == 0) {
            revert InvalidMetadata();
        }

        existing.companyName = companyName;
        existing.licenseCid = licenseCid;
        existing.updatedAt = block.timestamp;

        emit EmployerUpdated(msg.sender, companyName, licenseCid);
    }

    function setVerificationStatus(address wallet, VerificationStatus status) external onlyOwner {
        Employer storage existing = employers[wallet];
        if (existing.status == VerificationStatus.Unregistered) {
            revert EmployerNotRegistered();
        }
        existing.status = status;
        existing.updatedAt = block.timestamp;

        emit EmployerVerificationChanged(wallet, status);
    }

    function getEmployer(address wallet) external view returns (Employer memory) {
        return employers[wallet];
    }

    function isApproved(address wallet) external view returns (bool) {
        return employers[wallet].status == VerificationStatus.Approved;
    }
}