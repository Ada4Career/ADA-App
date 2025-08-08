# ADA Blockchain Integration

## Overview
This document explains the blockchain integration for the ADA accessible career platform using Lisk mainnet.

## Smart Contract: ADARegistry.sol

The `ADARegistry` contract provides basic registry functionality for the ADA platform:

### Features
- **User Registration**: Job seekers and HR personnel can register with their email and user type
- **Job Posting**: HR users can post job openings with accessibility levels
- **Job Matching**: Track job applications and match scores
- **Platform Statistics**: Monitor total users, jobs, and matches
- **Accessibility Focus**: Jobs include accessibility levels (standard, medium, high)

### Contract Functions

#### Core Functions
- `registerUser(email, userType, metadataHash)` - Register as job seeker (1) or HR (2)
- `postJob(title, company, metadataHash, accessibilityLevel)` - Post new job (HR only)
- `recordJobMatch(jobId, matchScore)` - Record job application with match score
- `getPlatformStats()` - Get platform statistics

#### View Functions
- `getUserProfile(address)` - Get user profile information
- `getJobPosting(jobId)` - Get job details
- `getContractInfo()` - Get platform name and version

## Deployment Instructions

### Prerequisites
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create `.env` file from `blockchain.env.example`:
   ```bash
   cp blockchain.env.example .env
   ```

3. Add your private key to `.env`:
   ```
   PRIVATE_KEY=your_wallet_private_key_here
   ```

### Deployment Steps

1. **Compile the contract:**
   ```bash
   pnpm contract:compile
   
   ```

2. **Deploy to Lisk mainnet:**
   ```bash
   pnpm contract:deploy
   ```

3. **Deploy to testnet (optional):**
   ```bash
   pnpm contract:deploy:testnet
   ```

### Network Configuration

#### Lisk Mainnet
- **RPC URL**: https://rpc.api.lisk.com
- **Chain ID**: 1135
- **Block Explorer**: https://blockscout.lisk.com

#### Lisk Sepolia Testnet
- **RPC URL**: https://rpc.sepolia-api.lisk.com  
- **Chain ID**: 4202
- **Block Explorer**: https://sepolia-blockscout.lisk.com

## For Lisk Spark Submission

After deployment, you'll get:

1. **Contract Address**: The deployed contract address on Lisk mainnet
2. **Transaction Hash**: The deployment transaction hash
3. **Block Explorer URL**: Link to view the contract on Blockscout

Example output:
```
🎉 Deployment Successful!
Contract Address: 0x1234567890abcdef...
Transaction Hash: 0xabcdef1234567890...
Blockscout URL: https://blockscout.lisk.com/address/0x1234567890abcdef...
```

## Contract Integration with Frontend

The contract can be integrated with your Next.js frontend using:

1. **Web3 Provider**: ethers.js or wagmi
2. **Contract ABI**: Generated in `artifacts/contracts/ADARegistry.sol/ADARegistry.json`
3. **Frontend Functions**: Connect wallet, register users, post jobs, track applications

## Security Considerations

- Contract includes basic access controls (onlyOwner, onlyActiveUser)
- Users can only register once and update their own metadata
- HR users can only post jobs, job seekers can only apply
- Emergency pause function for contract owner

## Gas Optimization

- Optimized with Hardhat compiler settings (200 runs)
- Efficient storage patterns
- Minimal external calls
- Events for off-chain indexing

## Future Enhancements

1. **IPFS Integration**: Store detailed user/job data on IPFS
2. **Token Incentives**: Reward system for platform usage
3. **Multi-sig Support**: Enhanced security for platform operations
4. **Oracle Integration**: Real-world job market data

## Support

For questions about the blockchain integration:
- Review the smart contract code in `/contracts/`
- Check deployment scripts in `/scripts/`
- Refer to Hardhat configuration in `hardhat.config.js`