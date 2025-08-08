// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ADA Career Registry
 * @dev Simple registry contract for ADA accessible career platform
 * @notice This contract manages basic registry functionality for the ADA platform
 */
contract ADARegistry {
    // Contract version
    string public constant VERSION = "1.0.0";
    string public constant PLATFORM_NAME = "ADA.AI - Accessible Career Platform";
    
    // Owner of the contract
    address public owner;
    
    // Registry data
    mapping(address => UserProfile) public userProfiles;
    mapping(bytes32 => JobPosting) public jobPostings;
    
    // Counters
    uint256 public totalUsers;
    uint256 public totalJobs;
    uint256 public totalMatches;
    
    // Structs
    struct UserProfile {
        string email;
        uint8 userType; // 1: job seeker, 2: HR
        bool isActive;
        uint256 createdAt;
        string metadataHash; // IPFS hash for additional data
    }
    
    struct JobPosting {
        address hrAddress;
        string title;
        string company;
        bool isActive;
        uint256 createdAt;
        string metadataHash; // IPFS hash for job details
        uint8 accessibilityLevel; // 1: standard, 2: medium, 3: high
    }
    
    // Events
    event UserRegistered(address indexed userAddress, string email, uint8 userType);
    event JobPosted(bytes32 indexed jobId, address indexed hrAddress, string title);
    event JobMatched(bytes32 indexed jobId, address indexed jobSeeker, uint256 matchScore);
    event PlatformStatsUpdated(uint256 users, uint256 jobs, uint256 matches);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyActiveUser() {
        require(userProfiles[msg.sender].isActive, "User not registered or inactive");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        emit PlatformStatsUpdated(0, 0, 0);
    }
    
    /**
     * @dev Register a new user on the platform
     * @param email User's email address
     * @param userType 1 for job seeker, 2 for HR
     * @param metadataHash IPFS hash containing additional user data
     */
    function registerUser(
        string memory email,
        uint8 userType,
        string memory metadataHash
    ) external {
        require(userType == 1 || userType == 2, "Invalid user type");
        require(!userProfiles[msg.sender].isActive, "User already registered");
        require(bytes(email).length > 0, "Email cannot be empty");
        
        userProfiles[msg.sender] = UserProfile({
            email: email,
            userType: userType,
            isActive: true,
            createdAt: block.timestamp,
            metadataHash: metadataHash
        });
        
        totalUsers++;
        
        emit UserRegistered(msg.sender, email, userType);
        emit PlatformStatsUpdated(totalUsers, totalJobs, totalMatches);
    }
    
    /**
     * @dev Post a new job (HR only)
     * @param title Job title
     * @param company Company name
     * @param metadataHash IPFS hash containing job details
     * @param accessibilityLevel Accessibility level (1-3)
     */
    function postJob(
        string memory title,
        string memory company,
        string memory metadataHash,
        uint8 accessibilityLevel
    ) external onlyActiveUser returns (bytes32) {
        require(userProfiles[msg.sender].userType == 2, "Only HR can post jobs");
        require(bytes(title).length > 0, "Job title cannot be empty");
        require(accessibilityLevel >= 1 && accessibilityLevel <= 3, "Invalid accessibility level");
        
        bytes32 jobId = keccak256(abi.encodePacked(msg.sender, title, block.timestamp));
        
        jobPostings[jobId] = JobPosting({
            hrAddress: msg.sender,
            title: title,
            company: company,
            isActive: true,
            createdAt: block.timestamp,
            metadataHash: metadataHash,
            accessibilityLevel: accessibilityLevel
        });
        
        totalJobs++;
        
        emit JobPosted(jobId, msg.sender, title);
        emit PlatformStatsUpdated(totalUsers, totalJobs, totalMatches);
        
        return jobId;
    }
    
    /**
     * @dev Record a job match
     * @param jobId The job identifier
     * @param matchScore Match score (0-100)
     */
    function recordJobMatch(bytes32 jobId, uint256 matchScore) external onlyActiveUser {
        require(userProfiles[msg.sender].userType == 1, "Only job seekers can apply");
        require(jobPostings[jobId].isActive, "Job not found or inactive");
        require(matchScore <= 100, "Match score cannot exceed 100");
        
        totalMatches++;
        
        emit JobMatched(jobId, msg.sender, matchScore);
        emit PlatformStatsUpdated(totalUsers, totalJobs, totalMatches);
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (uint256, uint256, uint256) {
        return (totalUsers, totalJobs, totalMatches);
    }
    
    /**
     * @dev Get user profile
     */
    function getUserProfile(address userAddress) external view returns (UserProfile memory) {
        return userProfiles[userAddress];
    }
    
    /**
     * @dev Get job posting details
     */
    function getJobPosting(bytes32 jobId) external view returns (JobPosting memory) {
        return jobPostings[jobId];
    }
    
    /**
     * @dev Update user metadata (user only)
     */
    function updateUserMetadata(string memory newMetadataHash) external onlyActiveUser {
        userProfiles[msg.sender].metadataHash = newMetadataHash;
    }
    
    /**
     * @dev Deactivate user account
     */
    function deactivateUser() external onlyActiveUser {
        userProfiles[msg.sender].isActive = false;
    }
    
    /**
     * @dev Emergency function to pause contract (owner only)
     */
    function emergencyPause() external onlyOwner {
        // In a more complex contract, this would pause all functions
        // For simplicity, we'll just emit an event
        emit PlatformStatsUpdated(0, 0, 0);
    }
    
    /**
     * @dev Get contract information
     */
    function getContractInfo() external pure returns (string memory, string memory) {
        return (PLATFORM_NAME, VERSION);
    }
}