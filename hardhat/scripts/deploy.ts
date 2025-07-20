import { ethers } from "hardhat";

async function main() {
  const Valuation = await ethers.getContractFactory("Valuation");
  
  console.log("Deploying Valuation contract...");
  const valuation = await Valuation.deploy();
  
  await valuation.waitForDeployment(); 

  const contractAddress = await valuation.getAddress();
  console.log("✅ Valuation contract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});