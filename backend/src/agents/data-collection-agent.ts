import axios from 'axios';

export async function run(input: { contractAddress: string; tokenId: string }): Promise<any> {
  const { contractAddress, tokenId } = input;
  console.log("Agent is fetching fresh data from Alchemy Sepolia API...");

  const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

  if (!ALCHEMY_API_KEY) {
    throw new Error("ALCHEMY_API_KEY is not configured in the .env file.");
  }

  const alchemyUrl = `https://eth-sepolia.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTMetadata`;
  const etherscanUrl = `https://api-sepolia.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const [alchemyResponse, etherscanResponse] = await Promise.all([
      axios.get(alchemyUrl, {
        params: {
          contractAddress: contractAddress,
          tokenId: tokenId,
        }
      }),
      axios.get(etherscanUrl)
    ]);

    // --- LOGS TO SHOW FULL API RESPONSE ---
    console.log("--- ALCHEMY API RESPONSE ---");
    console.log(JSON.stringify(alchemyResponse.data, null, 2));
    console.log("--- ETHERSCAN API RESPONSE ---");
    console.log(JSON.stringify(etherscanResponse.data, null, 2));
    // --- END OF LOGS ---

    if (!alchemyResponse.data || !alchemyResponse.data.contract) {
        throw new Error('NFT data not found on Alchemy.');
    }

    if (etherscanResponse.data.status === "0") {
        throw new Error(`Etherscan API Error: ${etherscanResponse.data.result}`);
    }

    const result = {
      alchemyData: alchemyResponse.data,
      etherscanData: etherscanResponse.data,
    };
    
    return result;

  } catch (error: any) {
    console.error("Agent failed to fetch data from external APIs", error.response?.data || error.message);
    throw new Error("Could not retrieve NFT data.");
  }
}