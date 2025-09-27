//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * MeritBase - Decentralized Identity Wallet for On-Chain CV
 * Allows users to build verifiable professional profiles and receive attestation stamps
 * @author MeritBase
 */
contract MeritBase is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter = 0;
    
    // Structs
    struct UserProfile {
        string name;
        string pseudonym;
        string[] skills;
        string[] workCategories;
        bool isActive;
        uint256 createdAt;
        uint256 lastUpdated;
    }
    
    struct JobStamp {
        uint256 tokenId;
        address client;
        string jobTitle;
        string summary;
        uint8 rating; // 1-5 stars
        uint256 completedDate;
        string clientSignature;
        bool isVerified;
    }
    
    // State Variables
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => JobStamp) public jobStamps;
    mapping(address => uint256[]) public userStamps; // user address => array of stamp token IDs
    mapping(address => bool) public registeredUsers;
    
    uint256 public totalProfiles = 0;
    uint256 public totalStamps = 0;
    
    // Events
    event ProfileCreated(address indexed user, string name, string pseudonym);
    event ProfileUpdated(address indexed user, string name, string pseudonym);
    event StampIssued(address indexed client, address indexed worker, uint256 tokenId, string jobTitle, uint8 rating);
    event StampVerified(uint256 indexed tokenId, bool verified);
    
    constructor() ERC721("MeritBase Stamp", "MBS") Ownable(msg.sender) {}
    
    // Modifiers
    modifier onlyRegisteredUser() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }
    
    modifier validRating(uint8 _rating) {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        _;
    }
    
    /**
     * Register a new user profile
     */
    function createProfile(
        string memory _name,
        string memory _pseudonym,
        string[] memory _skills,
        string[] memory _workCategories
    ) external {
        require(!registeredUsers[msg.sender], "Profile already exists");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        userProfiles[msg.sender] = UserProfile({
            name: _name,
            pseudonym: _pseudonym,
            skills: _skills,
            workCategories: _workCategories,
            isActive: true,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp
        });
        
        registeredUsers[msg.sender] = true;
        totalProfiles++;
        
        emit ProfileCreated(msg.sender, _name, _pseudonym);
    }
    
    /**
     * Update user profile
     */
    function updateProfile(
        string memory _name,
        string memory _pseudonym,
        string[] memory _skills,
        string[] memory _workCategories
    ) external onlyRegisteredUser {
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        userProfiles[msg.sender].name = _name;
        userProfiles[msg.sender].pseudonym = _pseudonym;
        userProfiles[msg.sender].skills = _skills;
        userProfiles[msg.sender].workCategories = _workCategories;
        userProfiles[msg.sender].lastUpdated = block.timestamp;
        
        emit ProfileUpdated(msg.sender, _name, _pseudonym);
    }
    
    /**
     * Issue a job stamp (attestation) to a worker
     */
    function giveStamp(
        address _worker,
        string memory _jobTitle,
        string memory _summary,
        uint8 _rating,
        string memory _clientSignature
    ) external validRating(_rating) {
        require(registeredUsers[_worker], "Worker not registered");
        require(bytes(_jobTitle).length > 0, "Job title cannot be empty");
        require(bytes(_summary).length > 0, "Summary cannot be empty");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(_worker, tokenId);
        
        JobStamp memory newStamp = JobStamp({
            tokenId: tokenId,
            client: msg.sender,
            jobTitle: _jobTitle,
            summary: _summary,
            rating: _rating,
            completedDate: block.timestamp,
            clientSignature: _clientSignature,
            isVerified: true
        });
        
        jobStamps[tokenId] = newStamp;
        userStamps[_worker].push(tokenId);
        totalStamps++;
        
        // Set token URI (could be IPFS hash or on-chain metadata)
        string memory tokenUri = string(abi.encodePacked(
            "https://meritbase.app/stamp/",
            _toString(tokenId)
        ));
        _setTokenURI(tokenId, tokenUri);
        
        emit StampIssued(msg.sender, _worker, tokenId, _jobTitle, _rating);
    }
    
    /**
     * Get user profile
     */
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        require(registeredUsers[_user], "User not registered");
        return userProfiles[_user];
    }
    
    /**
     * Get user's job stamps
     */
    function getUserStamps(address _user) external view returns (uint256[] memory) {
        return userStamps[_user];
    }
    
    /**
     * Get job stamp details
     */
    function getJobStamp(uint256 _tokenId) external view returns (JobStamp memory) {
        require(_tokenId > 0 && _tokenId <= _tokenIdCounter, "Stamp does not exist");
        return jobStamps[_tokenId];
    }
    
    /**
     * Get user's average rating
     */
    function getUserAverageRating(address _user) external view returns (uint256) {
        uint256[] memory stamps = userStamps[_user];
        if (stamps.length == 0) return 0;
        
        uint256 totalRating = 0;
        for (uint256 i = 0; i < stamps.length; i++) {
            totalRating += jobStamps[stamps[i]].rating;
        }
        
        return totalRating / stamps.length;
    }
    
    /**
     * Get user's total stamps count
     */
    function getUserStampsCount(address _user) external view returns (uint256) {
        return userStamps[_user].length;
    }
    
    /**
     * Verify a stamp (admin function)
     */
    function verifyStamp(uint256 _tokenId, bool _verified) external onlyOwner {
        require(_tokenId > 0 && _tokenId <= _tokenIdCounter, "Stamp does not exist");
        jobStamps[_tokenId].isVerified = _verified;
        emit StampVerified(_tokenId, _verified);
    }
    
    /**
     * Deactivate user profile
     */
    function deactivateProfile() external onlyRegisteredUser {
        userProfiles[msg.sender].isActive = false;
        userProfiles[msg.sender].lastUpdated = block.timestamp;
    }
    
    /**
     * Reactivate user profile
     */
    function reactivateProfile() external onlyRegisteredUser {
        userProfiles[msg.sender].isActive = true;
        userProfiles[msg.sender].lastUpdated = block.timestamp;
    }
    
    /**
     * Get contract statistics
     */
    function getStats() external view returns (uint256, uint256) {
        return (totalProfiles, totalStamps);
    }
    
    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    // Helper function to convert uint to string
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
