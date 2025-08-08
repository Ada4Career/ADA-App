const hre = require("hardhat");

async function main() {
  console.log("Deploying ADA Registry contract to Lisk mainnet...");
  
  // Get the contract factory
  const ADARegistry = await hre.ethers.getContractFactory("ADARegistry");
  
  // Deploy the contract
  console.log("Deploying contract...");
  const adaRegistry = await ADARegistry.deploy();
  
  // Wait for deployment
  await adaRegistry.waitForDeployment();
  
  const contractAddress = await adaRegistry.getAddress();
  const deploymentTx = adaRegistry.deploymentTransaction();
  
  console.log("\n🎉 Deployment Successful!");
  console.log("==========================================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Transaction Hash: ${deploymentTx.hash}`);
  console.log(`Block Number: ${deploymentTx.blockNumber}`);
  console.log(`Gas Used: ${deploymentTx.gasLimit.toString()}`);
  console.log(`Network: ${hre.network.name}`);
  console.log("==========================================");
  
  // Verify contract info
  const contractInfo = await adaRegistry.getContractInfo();
  console.log(`Platform Name: ${contractInfo[0]}`);
  console.log(`Version: ${contractInfo[1]}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    transactionHash: deploymentTx.hash,
    blockNumber: deploymentTx.blockNumber,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    platformName: contractInfo[0],
    version: contractInfo[1],
    deployedAt: new Date().toISOString(),
  };
  
  // Write to file
  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to deployment-info.json");
  console.log("\nFor Lisk Spark submission:");
  console.log(`Mainnet Contract Address: ${contractAddress}`);
  console.log(`Deployment Transaction: ${deploymentTx.hash}`);
  console.log(`Blockscout URL: https://blockscout.lisk.com/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:");
    console.error(error);
    process.exit(1);
  });