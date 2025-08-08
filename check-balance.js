const { ethers } = require('ethers');
require('dotenv').config();

async function checkBalance() {
  const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const balance = await provider.getBalance(wallet.address);
  const balanceInEther = ethers.formatEther(balance);
  
  console.log('='.repeat(40));
  console.log('Wallet Address:', wallet.address);
  console.log('Network: Lisk Sepolia Testnet');
  console.log('Balance:', balanceInEther, 'LSK');
  console.log('='.repeat(40));
  
  if (parseFloat(balanceInEther) > 0.001) {
    console.log('✅ You have enough LSK for deployment!');
    console.log('💡 Run: pnpm contract:deploy:testnet');
  } else {
    console.log('❌ Need more LSK tokens');
    console.log('💡 Visit: https://sepolia-faucet.lisk.com');
  }
}

checkBalance().catch(console.error);