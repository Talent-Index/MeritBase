// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FreelancerRegistry {
    struct Freelancer {
        address walletAddress;
        string displayName;
        string profileCid; // IPFS CID for profile data
        bytes32 cvHash; // keccak256 hash of CV content
        string govIdCid; // IPFS CID for government ID
        bool isRegistered;
    }

    mapping(address => Freelancer) public freelancers;
    address[] public freelancerAddresses;

    event FreelancerRegistered(address indexed walletAddress, string displayName, string profileCid);

    function registerFreelancer(
        address _walletAddress,
        string memory _displayName,
        string memory _profileCid,
        bytes32 _cvHash,
        string memory _govIdCid
    ) public {
        require(!freelancers[_walletAddress].isRegistered, "Freelancer already registered");

        freelancers[_walletAddress] = Freelancer({
            walletAddress: _walletAddress,
            displayName: _displayName,
            profileCid: _profileCid,
            cvHash: _cvHash,
            govIdCid: _govIdCid,
            isRegistered: true
        });

        freelancerAddresses.push(_walletAddress);

        emit FreelancerRegistered(_walletAddress, _displayName, _profileCid);
    }

    function getFreelancer(address _walletAddress) public view returns (string memory, string memory, bytes32, string memory) {
        return (
            freelancers[_walletAddress].displayName,
            freelancers[_walletAddress].profileCid,
            freelancers[_walletAddress].cvHash,
            freelancers[_walletAddress].govIdCid
        );
    }

    function isRegistered(address _walletAddress) public view returns (bool) {
        return freelancers[_walletAddress].isRegistered;
    }
}
