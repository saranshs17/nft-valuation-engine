export async function run(input: any): Promise<number> {
  const { alchemyData, etherscanData } = input;

  if (!alchemyData || !alchemyData.contract || !etherscanData || etherscanData.status !== "1") {
    throw new Error("Invalid input data for valuation.");
  }

  const lastSalePriceEth = 0; 
  const totalSupply = parseInt(etherscanData.result, 10) || 10000;
  
  const rarityFactor = Math.log(10000) / Math.log(totalSupply > 1 ? totalSupply : 2);
  const valuation = lastSalePriceEth * rarityFactor;

  console.log(`✔️  Valuation Agent calculated value: ${valuation} ETH`);

  return parseFloat(valuation.toFixed(4));
}