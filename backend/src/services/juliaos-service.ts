import { ethers } from 'ethers';
import 'dotenv/config';
import * as dataCollectionAgent from '../agents/data-collection-agent';
import * as valuationAgent from '../agents/valuation-agent';
import * as marketAnalysisAgent from '../agents/market-analysis-agent';
import ValuationContractAbi from '../../../hardhat/artifacts/contracts/Valuation.sol/Valuation.json';

const VALUATION_CONTRACT_ADDRESS = process.env.DEPLOYED_CONTRACT_ADDRESS || "";

export interface SwarmResult {
  valuation: number;
  confidence: number;
  factors: any;
  marketAnalysis: any;
  metadata: {
    name: string;
    imageUrl: string;
    collection: string;
    attributes: any[];
  };
}

export class JuliaosService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
    
    if (!VALUATION_CONTRACT_ADDRESS) {
      console.error("FATAL: DEPLOYED_CONTRACT_ADDRESS is not set in the environment.");
      process.exit(1);
    }

    this.contract = new ethers.Contract(VALUATION_CONTRACT_ADDRESS, ValuationContractAbi.abi, this.signer);
    
    console.log("🚀 JuliaOS Service Initialized - Multi-Agent Swarm Ready");
    console.log(`📍 Smart Contract: ${VALUATION_CONTRACT_ADDRESS}`);
  }

  async runSwarmValuation(contractAddress: string, tokenId: string): Promise<SwarmResult> {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║    JuliaOS AGENT SWARM ACTIVATION     ║`);
    console.log(`╚════════════════════════════════════════╝`);
    console.log(`🎯 Target: ${contractAddress} #${tokenId}\n`);

    console.log("📡 PHASE 1: Data Collection Agent");
    const collectedData = await dataCollectionAgent.run({ contractAddress, tokenId });
    
    console.log("\n🔄 PHASE 2: Parallel Agent Analysis");
    const [valuationResult, marketAnalysis] = await Promise.all([
      valuationAgent.run(collectedData),
      marketAnalysisAgent.run(collectedData)
    ]);
    
    console.log("\n⛓️  PHASE 3: Blockchain Integration");
    try {
      const valueInWei = ethers.parseEther(valuationResult.estimatedValue.toString());
      const tx = await this.contract.setValuation(contractAddress, tokenId, valueInWei);
      
      console.log(`📝 Transaction Hash: ${tx.hash}`);
      console.log(`⏳ Waiting for confirmation...`);
      const receipt = await tx.wait();
      console.log(`✅ Confirmed in block ${receipt.blockNumber}`);

    } catch (error) {
      console.error("❌ Blockchain transaction failed:", error);
    }

    const swarmResult: SwarmResult = {
      valuation: valuationResult.estimatedValue,
      confidence: valuationResult.confidence,
      factors: valuationResult.factors,
      marketAnalysis: marketAnalysis,
      metadata: {
        name: collectedData.nftMetadata.title,
        imageUrl: this.extractImageUrl(collectedData.nftMetadata),
        collection: collectedData.collectionStats.contractName,
        attributes: collectedData.nftMetadata.attributes || []
      }
    };

    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║        SWARM EXECUTION COMPLETE        ║`);
    console.log(`╚════════════════════════════════════════╝`);
    console.log(`💎 Final Valuation: ${swarmResult.valuation.toFixed(4)} ETH`);
    console.log(`📊 Confidence: ${swarmResult.confidence}%`);
    console.log(`📈 Market Trend: ${marketAnalysis.trend}`);

    return swarmResult;
  }

  private extractImageUrl(metadata: any): string {
  
  if (metadata.media && metadata.media.length > 0) {
    const media = metadata.media[0];
    return media.gateway || media.thumbnail || media.raw || '';
  }
  
  if (metadata.image) {
    return metadata.image;
  }
  
  if (metadata.metadata?.image) {
    return metadata.metadata.image;
  }
  
  return '';
}
}