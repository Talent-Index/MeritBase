// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FreelancerRegistry {
    struct Freelancer {
        address owner;
        string displayName;
        string profileCid; // IPFS CID for public profile metadata
        bytes32 cvHash; // keccak256 hash of the CV content
        string govIdCid; // IPFS CID for encrypted government ID
        uint256 registeredAt;
    }

    mapping(address => Freelancer) public freelancers;
    address[] public freelancerAddresses;

    event FreelancerRegistered(address indexed owner, string profileCid, bytes32 cvHash, uint256 timestamp);
    event FreelancerUpdated(address indexed owner, string profileCid, bytes32 cvHash, uint256 timestamp);

    function registerOrUpdateFreelancer(
        string memory _displayName,
        string memory _profileCid,
        bytes32 _cvHash,
        string memory _govIdCid
    ) public {
        if (freelancers[msg.sender].owner == address(0)) {
            // New registration
            freelancers[msg.sender] = Freelancer({
                owner: msg.sender,
                displayName: _displayName,
                profileCid: _profileCid,
                cvHash: _cvHash,
                govIdCid: _govIdCid,
                registeredAt: block.timestamp
            });
            freelancerAddresses.push(msg.sender);
            emit FreelancerRegistered(msg.sender, _profileCid, _cvHash, block.timestamp);
        } else {
            // Update existing registration
            freelancers[msg.sender].displayName = _displayName;
            freelancers[msg.sender].profileCid = _profileCid;
            freelancers[msg.sender].cvHash = _cvHash;
            freelancers[msg.sender].govIdCid = _govIdCid;
            emit FreelancerUpdated(msg.sender, _profileCid, _cvHash, block.timestamp);
        }
    }

    function getFreelancer(address _owner) public view returns (Freelancer memory) {
        return freelancers[_owner];
    }

    function getFreelancerCount() public view returns (uint256) {
        return freelancerAddresses.length;
    }
}
