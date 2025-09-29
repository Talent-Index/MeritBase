// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title FreelancerRegistry - On-chain verification and profile hashes for Meritbase freelancers
/// @notice Stores lightweight KYC status and IPFS references for freelancer CVWallets
contract FreelancerRegistry is Ownable {
    enum VerificationStatus {
        Unregistered,
        Pending,
        Approved,
        Rejected
    }

    struct Freelancer {
        address wallet;
        string fullName;
        string email;
        string phone;
        string profileCid; // IPFS CID for CVWallet metadata
        string govIdCid; // IPFS CID for government ID upload
        bytes32 cvHash; // Hash of the CVWallet JSON stored on IPFS
        VerificationStatus status;
        uint256 createdAt;
        uint256 updatedAt;
    }

    mapping(address => Freelancer) private freelancers;

    event FreelancerRegistered(address indexed wallet, string profileCid, bytes32 cvHash);
    event FreelancerUpdated(address indexed wallet, string profileCid, bytes32 cvHash);
    event FreelancerVerificationChanged(address indexed wallet, VerificationStatus status);

    error FreelancerAlreadyRegistered();
    error FreelancerNotRegistered();
    error InvalidMetadata();

    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Register a new freelancer with minimal KYC metadata
    /// @dev Stores profile metadata hash references while keeping PIIs off-chain
    function registerFreelancer(
        string calldata fullName,
        string calldata email,
        string calldata phone,
        string calldata profileCid,
        string calldata govIdCid,
        bytes32 cvHash
    ) external {
        Freelancer storage existing = freelancers[msg.sender];
        if (existing.status != VerificationStatus.Unregistered) {
            revert FreelancerAlreadyRegistered();
        }
        if (bytes(profileCid).length == 0 || bytes(govIdCid).length == 0 || cvHash == bytes32(0)) {
            revert InvalidMetadata();
        }

        freelancers[msg.sender] = Freelancer({
            wallet: msg.sender,
            fullName: fullName,
            email: email,
            phone: phone,
            profileCid: profileCid,
            govIdCid: govIdCid,
            cvHash: cvHash,
            status: VerificationStatus.Pending,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        emit FreelancerRegistered(msg.sender, profileCid, cvHash);
        emit FreelancerVerificationChanged(msg.sender, VerificationStatus.Pending);
    }

    /// @notice Update IPFS references and hashed CV for an existing freelancer
    function updateFreelancer(
        string calldata profileCid,
        bytes32 cvHash
    ) external {
        Freelancer storage existing = freelancers[msg.sender];
        if (existing.status == VerificationStatus.Unregistered) {
            revert FreelancerNotRegistered();
        }
        if (bytes(profileCid).length == 0 || cvHash == bytes32(0)) {
            revert InvalidMetadata();
        }

        existing.profileCid = profileCid;
        existing.cvHash = cvHash;
        existing.updatedAt = block.timestamp;

        emit FreelancerUpdated(msg.sender, profileCid, cvHash);
    }

    /// @notice Admin control to approve or reject a freelancer after manual review
    function setVerificationStatus(address wallet, VerificationStatus status) external onlyOwner {
        Freelancer storage existing = freelancers[wallet];
        if (existing.status == VerificationStatus.Unregistered) {
            revert FreelancerNotRegistered();
        }
        existing.status = status;
        existing.updatedAt = block.timestamp;

        emit FreelancerVerificationChanged(wallet, status);
    }

    function getFreelancer(address wallet) external view returns (Freelancer memory) {
        return freelancers[wallet];
    }

    function isApproved(address wallet) external view returns (bool) {
        return freelancers[wallet].status == VerificationStatus.Approved;
    }
}