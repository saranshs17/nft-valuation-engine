import { CollectedData } from './data-collection-agent';

export interface MarketAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral';
  volatility: 'high' | 'medium' | 'low';
  liquidityScore: number;
  priceHistory: number[];
  recommendation: string;
}

export async function run(input: CollectedData): Promise<MarketAnalysis> {
  console.log("📊 Market Analysis Agent: Performing deep market analysis...");

  const { marketData, collectionStats } = input;
  const recentSales = marketData.recentSales || [];
  const priceHistory = extractPriceHistory(recentSales);
  const trend = analyzeTrend(priceHistory);
  const volatility = analyzeVolatility(priceHistory);
  const liquidityScore = calculateLiquidity(recentSales.length, collectionStats.totalSupply);

  const recommendation = generateRecommendation(trend, volatility, liquidityScore);

  const result: MarketAnalysis = {
    trend,
    volatility,
    liquidityScore,
    priceHistory,
    recommendation
  };

  console.log(`✅ Market Analysis Agent: ${trend} trend detected with ${volatility} volatility`);

  return result;
}

function extractPriceHistory(sales: any[]): number[] {
  return sales
    .filter((sale: any) => sale.value !== "0")
    .map((sale: any) => parseFloat(sale.value) / 1e18)
    .slice(0, 10);
}

function analyzeTrend(prices: number[]): 'bullish' | 'bearish' | 'neutral' {
  if (prices.length < 2) return 'neutral';
  
  const recentAvg = prices.slice(0, Math.floor(prices.length / 2)).reduce((a, b) => a + b, 0) / (prices.length / 2);
  const olderAvg = prices.slice(Math.floor(prices.length / 2)).reduce((a, b) => a + b, 0) / (prices.length / 2);
  
  if (recentAvg > olderAvg * 1.1) return 'bullish';
  if (recentAvg < olderAvg * 0.9) return 'bearish';
  return 'neutral';
}

function analyzeVolatility(prices: number[]): 'high' | 'medium' | 'low' {
  if (prices.length < 2) return 'low';
  
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avg;
  
  if (coefficientOfVariation > 0.5) return 'high';
  if (coefficientOfVariation > 0.2) return 'medium';
  return 'low';
}

function calculateLiquidity(salesCount: number, totalSupply: number): number {
  const salesRatio = salesCount / totalSupply;
  return Math.min(100, salesRatio * 1000);
}

function generateRecommendation(trend: string, volatility: string, liquidity: number): string {
  if (trend === 'bullish' && volatility === 'low' && liquidity > 50) {
    return 'Strong buy signal: Positive trend with stable prices and good liquidity';
  } else if (trend === 'bearish' && volatility === 'high') {
    return 'Hold or wait: Declining prices with high volatility';
  } else if (liquidity < 20) {
    return 'Caution: Low liquidity may make it difficult to sell';
  }
  return 'Neutral: Monitor market conditions before making a decision';
}