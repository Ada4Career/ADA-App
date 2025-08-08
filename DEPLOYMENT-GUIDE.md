# Lisk Mainnet Deployment Guide

## Quick Setup

### 1. Prerequisites
- Node.js installed
- A wallet with some LSK tokens for gas fees
- Your wallet's private key

### 2. Environment Setup
1. Copy the environment file:
   ```bash
   cp blockchain.env.example .env
   ```

2. Edit `.env` and add your private key:
   ```
   PRIVATE_KEY=your_private_key_here_without_0x_prefix
   ```

### 3. Get LSK Tokens
- You need LSK tokens on Lisk mainnet for deployment
- Get them from exchanges like Binance, KuCoin, etc.
- Send to your wallet address

### 4. Deploy Contract

**Test deployment first (optional):**
```bash
pnpm contract:deploy:testnet
```

**Deploy to mainnet:**
```bash
pnpm contract:deploy
```

### 5. Expected Output
```
🎉 Deployment Successful!
==========================================
Contract Address: 0x1234567890abcdef1234567890abcdef12345678
Transaction Hash: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab
Block Number: 123456
Gas Used: 1500000
Network: lisk
==========================================
Platform Name: ADA.AI - Accessible Career Platform
Version: 1.0.0

For Lisk Spark submission:
Mainnet Contract Address: 0x1234567890abcdef1234567890abcdef12345678
Deployment Transaction: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab
Blockscout URL: https://blockscout.lisk.com/address/0x1234567890abcdef1234567890abcdef12345678
```

## Important Information for Lisk Spark

After successful deployment, you'll have:

1. **Contract Address**: The unique address where your contract lives on Lisk mainnet
2. **Transaction Hash**: Proof of deployment transaction
3. **Blockscout URL**: Public verification link

These are exactly what Lisk Spark needs for verification!

## Troubleshooting

### Common Issues:

1. **"Insufficient funds"**
   - You need LSK tokens for gas fees
   - Get them from crypto exchanges

2. **"Invalid private key"**
   - Make sure your private key doesn't have "0x" prefix
   - Keep your private key secure and never share it

3. **"Network error"**
   - Check your internet connection
   - Lisk RPC might be temporarily down

### Getting Help:
- Check Lisk documentation: https://lisk.com/documentation
- Lisk Discord: https://lisk.chat
- Blockscout explorer: https://blockscout.lisk.com

## Contract Features

Your deployed ADARegistry contract includes:
- User registration (job seekers & HR)
- Job posting with accessibility levels
- Job matching and application tracking
- Platform statistics
- Event logging for transparency

## Next Steps

After deployment:
1. Save your contract address and transaction hash
2. Submit these to Lisk Spark
3. Optionally verify your contract on Blockscout
4. Integrate with your frontend application

## Security Notes

- Never share your private key
- Your contract is immutable once deployed
- Test thoroughly on testnet first
- Keep deployment info secure but shareable for verification