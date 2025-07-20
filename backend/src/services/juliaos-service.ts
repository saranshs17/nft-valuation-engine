import { ethers } from 'ethers';
import 'dotenv/config';
import * as dataCollectionAgent from '../agents/data-collection-agent';
import * as valuationAgent from '../agents/valuation-agent';
import ValuationContractAbi from '../../../hardhat/artifacts/contracts/Valuation.sol/Valuation.json';

const VALUATION_CONTRACT_ADDRESS = process.env.DEPLOYED_CONTRACT_ADDRESS || "";

export class JuliaosService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
    
    if (!VALUATION_CONTRACT_ADDRESS) {
      console.error("FATAL: DEPLOYED_CONTRACT_ADDRESS is not set in the environment. Please check your setup.");
      process.exit(1);
    }

    this.contract = new ethers.Contract(VALUATION_CONTRACT_ADDRESS, ValuationContractAbi.abi, this.signer);
    
    console.log("✅ JuliaOS Service Initialized");
    console.log(`- Interacting with contract at: ${VALUATION_CONTRACT_ADDRESS}`);
  }

  async getValuation(contractAddress: string, tokenId: string): Promise<number> {
    console.log(`\n--- Starting New Valuation ---`);
    console.log("➡️  Invoking Data Collection Agent...");
    const collectedData = await dataCollectionAgent.run({ contractAddress, tokenId });
    
    console.log("➡️  Invoking Valuation Agent...");
    const finalValuation = await valuationAgent.run(collectedData);
    
    try {
      console.log("➡️  Sending transaction to store valuation on-chain...");
      const valueInWei = ethers.parseEther(finalValuation.toString());
      const tx = await this.contract.setValuation(contractAddress, tokenId, valueInWei);
      
      console.log(`Transaction sent! Hash: ${tx.hash}`);
      await tx.wait();
      console.log("✔️  Transaction confirmed! Valuation is now stored on-chain.");

    } catch (error) {
      console.error("❌ Error sending transaction to the smart contract:", error);
    }

    console.log(`--- Valuation Complete ---`);
    return finalValuation;
  }
}