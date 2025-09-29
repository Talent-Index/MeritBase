// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FreelancerRegistry {
    struct Freelancer {
        address owner;
        string displayName;
        string profileCid; // IPFS CID for the public profile JSON
        bytes32 cvHash; // keccak256 hash of the canonical CV metadata
        string govIdCid; // IPFS CID for the encrypted government ID
        uint256 registeredAt;
    }

    mapping(address => Freelancer) public freelancers;
    address[] public freelancerList;

    event FreelancerRegistered(address indexed owner, bytes32 indexed cvHash, string profileCid, uint256 ts);
    event FreelancerUpdated(address indexed owner, bytes32 indexed cvHash, string profileCid, uint256 ts);

    modifier onlyRegisteredFreelancer() {
        require(freelancers[msg.sender].owner != address(0), "Freelancer not registered");
        _;
    }

    function registerFreelancer(string calldata displayName, string calldata profileCid, bytes32 cvHash, string calldata govIdCid) external returns (bool) {
        require(bytes(displayName).length > 0, "Display name cannot be empty");
        require(freelancers[msg.sender].owner == address(0), "Freelancer already registered");

        freelancers[msg.sender] = Freelancer({
            owner: msg.sender,
            displayName: displayName,
            profileCid: profileCid,
            cvHash: cvHash,
            govIdCid: govIdCid,
            registeredAt: block.timestamp
        });

        freelancerList.push(msg.sender);

        emit FreelancerRegistered(msg.sender, cvHash, profileCid, block.timestamp);
        return true;
    }

    function updateFreelancer(string calldata displayName, string calldata profileCid, bytes32 cvHash, string calldata govIdCid) external onlyRegisteredFreelancer returns (bool) {
        require(bytes(displayName).length > 0, "Display name cannot be empty");

        Freelancer storage freelancer = freelancers[msg.sender];
        freelancer.displayName = displayName;
        freelancer.profileCid = profileCid;
        freelancer.cvHash = cvHash;
        freelancer.govIdCid = govIdCid;

        emit FreelancerUpdated(msg.sender, cvHash, profileCid, block.timestamp);
        return true;
    }

    function getFreelancer(address owner) public view returns (Freelancer memory) {
        return freelancers[owner];
    }

    function getFreelancerCount() public view returns (uint256) {
        return freelancerList.length;
    }
}
