// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EmployerRegistry {
    struct Employer {
        address walletAddress;
        string companyName;
        string workEmail;
        string licenseCid; // IPFS CID for business license
        bool isRegistered;
    }

    mapping(address => Employer) public employers;
    address[] public employerAddresses;

    event EmployerRegistered(address indexed walletAddress, string companyName);

    function registerEmployer(
        address _walletAddress,
        string memory _companyName,
        string memory _workEmail,
        string memory _licenseCid
    ) public {
        require(!employers[_walletAddress].isRegistered, "Employer already registered");

        employers[_walletAddress] = Employer({
            walletAddress: _walletAddress,
            companyName: _companyName,
            workEmail: _workEmail,
            licenseCid: _licenseCid,
            isRegistered: true
        });
        
        employerAddresses.push(_walletAddress);

        emit EmployerRegistered(_walletAddress, _companyName);
    }

    function getEmployer(address _walletAddress) public view returns (string memory, string memory, string memory) {
        return (
            employers[_walletAddress].companyName,
            employers[_walletAddress].workEmail,
            employers[_walletAddress].licenseCid
        );
    }
    
    function isRegistered(address _walletAddress) public view returns (bool) {
        return employers[_walletAddress].isRegistered;
    }
}
