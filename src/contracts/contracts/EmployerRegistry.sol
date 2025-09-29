// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EmployerRegistry {
    struct Employer {
        address owner;
        string companyName;
        string contactEmail;
        string licenseCid; // IPFS CID for encrypted business license
        uint256 registeredAt;
    }

    mapping(address => Employer) public employers;
    address[] public employerAddresses;

    event EmployerRegistered(address indexed owner, string companyName, string licenseCid, uint256 timestamp);
    event EmployerUpdated(address indexed owner, string companyName, string licenseCid, uint256 timestamp);


    function registerOrUpdateEmployer(
        string memory _companyName,
        string memory _contactEmail,
        string memory _licenseCid
    ) public {
        if (employers[msg.sender].owner == address(0)) {
            // New registration
            employers[msg.sender] = Employer({
                owner: msg.sender,
                companyName: _companyName,
                contactEmail: _contactEmail,
                licenseCid: _licenseCid,
                registeredAt: block.timestamp
            });
            employerAddresses.push(msg.sender);
            emit EmployerRegistered(msg.sender, _companyName, _licenseCid, block.timestamp);
        } else {
            // Update existing registration
            employers[msg.sender].companyName = _companyName;
            employers[msg.sender].contactEmail = _contactEmail;
            employers[msg.sender].licenseCid = _licenseCid;
            emit EmployerUpdated(msg.sender, _companyName, _licenseCid, block.timestamp);
        }
    }

    function getEmployer(address _owner) public view returns (Employer memory) {
        return employers[_owner];
    }

    function getEmployerCount() public view returns (uint256) {
        return employerAddresses.length;
    }
}
