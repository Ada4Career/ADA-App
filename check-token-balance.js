const { ethers } = require('ethers');
require('dotenv').config();

async function checkTokenBalance() {
  const provider = new ethers.JsonRpcProvider('https://rpc.sepolia-api.lisk.com');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  // Check native balance
  const nativeBalance = await provider.getBalance(wallet.address);
  const nativeBalanceInEther = ethers.formatEther(nativeBalance);
  
  // LSK Token contract on Lisk Sepolia
  const LSK_TOKEN_ADDRESS = '0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D';
  
  // ERC-20 ABI for balanceOf
  const erc20Abi = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
  ];
  
  const tokenContract = new ethers.Contract(LSK_TOKEN_ADDRESS, erc20Abi, provider);
  
  try {
    const tokenBalance = await tokenContract.balanceOf(wallet.address);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();
    const tokenBalanceFormatted = ethers.formatUnits(tokenBalance, decimals);
    
    console.log('='.repeat(50));
    console.log('Wallet Address:', wallet.address);
    console.log('Network: Lisk Sepolia Testnet');
    console.log('='.repeat(50));
    console.log('Native Balance:', nativeBalanceInEther, 'ETH (for gas)');
    console.log('LSK Token Balance:', tokenBalanceFormatted, symbol);
    console.log('='.repeat(50));
    
    if (parseFloat(tokenBalanceFormatted) > 0) {
      console.log('✅ You have LSK tokens!');
      console.log('❌ But you need native ETH for gas fees');
      console.log('💡 The faucet gave you LSK tokens, but you need ETH for deployment');
      console.log('💡 Try requesting ETH from: https://sepolia-faucet.lisk.com');
    }
    
    if (parseFloat(nativeBalanceInEther) > 0.001) {
      console.log('✅ You have enough ETH for deployment!');
      console.log('💡 Run: pnpm contract:deploy:testnet');
    } else {
      console.log('❌ Need native ETH for gas fees');
      console.log('💡 Visit faucet for ETH (not LSK tokens)');
    }
    
  } catch (error) {
    console.error('Error checking token balance:', error);
  }
}

checkTokenBalance().catch(console.error);