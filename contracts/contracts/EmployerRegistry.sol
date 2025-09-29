// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EmployerRegistry {
    struct Employer {
        address owner;
        string companyName;
        string contactEmail;
        string licenseCid; // IPFS CID for the license document
        uint256 registeredAt;
    }

    mapping(address => Employer) public employers;
    address[] public employerList;

    event EmployerRegistered(address indexed owner, string companyName, string licenseCid, uint256 ts);
    event EmployerUpdated(address indexed owner, string companyName, string licenseCid, uint256 ts);

    modifier onlyRegisteredEmployer() {
        require(employers[msg.sender].owner != address(0), "Employer not registered");
        _;
    }

    function registerEmployer(string calldata companyName, string calldata contactEmail, string calldata licenseCid) external returns (bool) {
        require(bytes(companyName).length > 0, "Company name cannot be empty");
        require(employers[msg.sender].owner == address(0), "Employer already registered");

        employers[msg.sender] = Employer({
            owner: msg.sender,
            companyName: companyName,
            contactEmail: contactEmail,
            licenseCid: licenseCid,
            registeredAt: block.timestamp
        });
        
        employerList.push(msg.sender);

        emit EmployerRegistered(msg.sender, companyName, licenseCid, block.timestamp);
        return true;
    }

    function updateEmployer(string calldata companyName, string calldata contactEmail, string calldata licenseCid) external onlyRegisteredEmployer returns (bool) {
        require(bytes(companyName).length > 0, "Company name cannot be empty");

        Employer storage employer = employers[msg.sender];
        employer.companyName = companyName;
        employer.contactEmail = contactEmail;
        employer.licenseCid = licenseCid;

        emit EmployerUpdated(msg.sender, companyName, licenseCid, block.timestamp);
        return true;
    }

    function getEmployer(address owner) public view returns (Employer memory) {
        return employers[owner];
    }

    function getEmployerCount() public view returns (uint256) {
        return employerList.length;
    }
}
