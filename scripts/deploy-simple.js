const hre = require("hardhat");

async function main() {
  console.log("Deploying ADA Registry contract to Lisk Sepolia testnet...");
  
  // Check balance first
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("Deploying from address:", deployer.address);
  console.log("Current balance:", hre.ethers.formatEther(balance), "LSK");
  
  if (balance === 0n) {
    console.error("❌ No LSK tokens found!");
    console.log("Please get testnet tokens from:");
    console.log("1. https://sepolia-faucet.lisk.com");
    console.log("2. Discord: https://lisk.chat (use /faucet command)");
    console.log("3. Your wallet address:", deployer.address);
    return;
  }
  
  // Get the contract factory
  const ADARegistry = await hre.ethers.getContractFactory("ADARegistry");
  
  // Deploy with minimal gas settings
  console.log("Deploying contract with minimal gas...");
  const adaRegistry = await ADARegistry.deploy({
    gasLimit: 2000000, // Lower gas limit
    gasPrice: hre.ethers.parseUnits("1", "gwei"), // Lower gas price
  });
  
  console.log("Waiting for deployment...");
  await adaRegistry.waitForDeployment();
  
  const contractAddress = await adaRegistry.getAddress();
  const deploymentTx = adaRegistry.deploymentTransaction();
  
  console.log("\n🎉 Deployment Successful!");
  console.log("==========================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Transaction Hash: ${deploymentTx.hash}`);
  console.log(`Network: Lisk Sepolia Testnet`);
  console.log(`Explorer: https://sepolia-blockscout.lisk.com/address/${contractAddress}`);
  console.log("==========================================");
  
  // Save deployment info for Lisk Spark
  const deploymentInfo = {
    contractAddress: contractAddress,
    transactionHash: deploymentTx.hash,
    network: "Lisk Sepolia Testnet",
    chainId: 4202,
    explorerUrl: `https://sepolia-blockscout.lisk.com/address/${contractAddress}`,
    deployedAt: new Date().toISOString(),
    note: "Deployed on Lisk Sepolia testnet for Lisk Spark submission"
  };
  
  console.log("\n📋 FOR LISK SPARK SUBMISSION:");
  console.log(`Network: Lisk Sepolia Testnet`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Transaction Hash: ${deploymentTx.hash}`);
  console.log(`Block Explorer: https://sepolia-blockscout.lisk.com/address/${contractAddress}`);
  
  // Write to file
  const fs = require('fs');
  fs.writeFileSync(
    'lisk-spark-submission.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to lisk-spark-submission.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:");
    console.error(error);
    process.exit(1);
  });