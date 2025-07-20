import { CollectedData } from './data-collection-agent';

export interface ValuationResult {
  estimatedValue: number;
  confidence: number;
  factors: {
    rarity: number;
    market: number;
    utility: number;
    trend: number;
  };
  methodology: string;
}

export async function run(input: CollectedData): Promise<ValuationResult> {
  console.log("💰 Valuation Agent: Analyzing NFT value using multi-factor model...");

  const { nftMetadata, collectionStats, marketData } = input;

  const rarityScore = calculateRarityScore(nftMetadata.attributes, collectionStats.totalSupply);

  const marketScore = calculateMarketScore(collectionStats.floorPrice, marketData);

  const utilityScore = calculateUtilityScore(nftMetadata);

  const trendScore = calculateTrendScore(marketData.recentSales);

  const weights = {
    rarity: 0.3,
    market: 0.4,
    utility: 0.1,
    trend: 0.2
  };

  let baseValue = collectionStats.floorPrice || 0.01; 
  
  if (marketData.lastSalePrice > 0) {
    baseValue = marketData.lastSalePrice * 0.7 + baseValue * 0.3;
  }

  const multiplier = (
    rarityScore * weights.rarity +
    marketScore * weights.market +
    utilityScore * weights.utility +
    trendScore * weights.trend
  );

  const estimatedValue = baseValue * multiplier;
  const confidence = calculateConfidence(input, { rarityScore, marketScore, utilityScore, trendScore });

  const result: ValuationResult = {
    estimatedValue: Math.max(0.001, estimatedValue),
    confidence,
    factors: {
      rarity: rarityScore,
      market: marketScore,
      utility: utilityScore,
      trend: trendScore
    },
    methodology: "Multi-factor AI valuation model using rarity, market dynamics, utility, and trend analysis"
  };

  console.log(`✅ Valuation Agent: Estimated value: ${result.estimatedValue.toFixed(4)} ETH (${result.confidence}% confidence)`);
  console.log(`   Factors - Rarity: ${rarityScore.toFixed(2)}, Market: ${marketScore.toFixed(2)}, Utility: ${utilityScore.toFixed(2)}, Trend: ${trendScore.toFixed(2)}`);

  return result;
}

function calculateRarityScore(attributes: any[], totalSupply: number): number {
  if (!attributes || attributes.length === 0) return 1.0;
  
  const attributeRarity = Math.min(2, 1 + (attributes.length / 10));
  const supplyRarity = Math.log(10000) / Math.log(Math.max(totalSupply, 2));
  
  return (attributeRarity + supplyRarity) / 2;
}

function calculateMarketScore(floorPrice: number, marketData: any): number {
  if (floorPrice === 0) return 1.0;
  
  const salesCount = marketData.recentSales?.length || 0;
  const activityScore = Math.min(2, 1 + (salesCount / 10));
  
  return activityScore;
}

function calculateUtilityScore(metadata: any): number {
  let score = 1.0;
  
  if (metadata.title && metadata.title !== '') score += 0.2;
  if (metadata.description && metadata.description !== '') score += 0.2;
  if (metadata.media && metadata.media.length > 0) score += 0.3;
  if (metadata.attributes && metadata.attributes.length > 0) score += 0.3;
  
  return Math.min(2, score);
}

function calculateTrendScore(recentSales: any[]): number {
  if (!recentSales || recentSales.length < 2) return 1.0;
  
  return Math.min(2, 1 + (recentSales.length / 20));
}

function calculateConfidence(data: CollectedData, factors: any): number {
  let confidence = 30;
  
  if (data.nftMetadata.title && data.nftMetadata.title !== 'Unnamed NFT') confidence += 10;
  if (data.nftMetadata.media && data.nftMetadata.media.length > 0) confidence += 10;
  if (data.nftMetadata.attributes && data.nftMetadata.attributes.length > 0) {
    confidence += Math.min(15, data.nftMetadata.attributes.length * 3);
  }
  
  if (data.collectionStats.totalSupply > 0 && data.collectionStats.totalSupply < 100000) confidence += 10;
  if (data.collectionStats.contractName && data.collectionStats.contractName !== 'Unknown Collection') confidence += 5;
  
  const avgFactorScore = (factors.rarityScore + factors.marketScore + factors.utilityScore + factors.trendScore) / 4;
  if (avgFactorScore > 1.2) confidence += 10;
  if (avgFactorScore > 1.5) confidence += 10;
  
  
  if (data.marketData.lastSalePrice > 0) confidence += 15;
  if (data.marketData.recentSales && data.marketData.recentSales.length > 0) {
    confidence += Math.min(10, data.marketData.recentSales.length * 2);
  }
  
  const hasMarketData = data.marketData.lastSalePrice > 0 || data.collectionStats.floorPrice > 0;
  if (!hasMarketData) {
    
    confidence = Math.min(75, confidence);
  }
  
  return Math.min(95, Math.max(20, confidence)); 
}