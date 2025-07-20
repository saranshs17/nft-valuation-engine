import axios from 'axios';

export interface CollectedData {
  nftMetadata: any;
  collectionStats: any;
  marketData: any;
  onChainData: any;
}

export async function run(input: { contractAddress: string; tokenId: string }): Promise<CollectedData> {
  const { contractAddress, tokenId } = input;
  console.log("🔍 Data Collection Agent: Initiating multi-source data gathering...");

  const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || "";
  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

  if (!ALCHEMY_API_KEY || !ETHERSCAN_API_KEY) {
    throw new Error("API keys are not configured properly.");
  }

  try {
    const [alchemyNFT, alchemyFloor, etherscanSupply, etherscanTxs] = await Promise.all([
      axios.get(`https://eth-sepolia.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTMetadata`, {
        params: { contractAddress, tokenId }
      }),

      axios.get(`https://eth-sepolia.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getFloorPrice`, {
        params: { contractAddress }
      }).catch(() => ({ data: { openSea: { floorPrice: 0 } } })),

      axios.get(`https://api-sepolia.etherscan.io/api`, {
        params: {
          module: 'stats',
          action: 'tokensupply',
          contractaddress: contractAddress,
          apikey: ETHERSCAN_API_KEY
        }
      }),
      
      axios.get(`https://api-sepolia.etherscan.io/api`, {
        params: {
          module: 'account',
          action: 'tokennfttx',
          contractaddress: contractAddress,
          page: 1,
          offset: 10,
          sort: 'desc',
          apikey: ETHERSCAN_API_KEY
        }
      }).catch(() => ({ data: { status: "0", result: [] } }))
    ]);

    console.log("✅ Data Collection Agent: Successfully gathered data from all sources");

    
    const result: CollectedData = {
      nftMetadata: {
        ...alchemyNFT.data,
        title: alchemyNFT.data.title || alchemyNFT.data.metadata?.name || `Token #${tokenId}`,
        description: alchemyNFT.data.description || alchemyNFT.data.metadata?.description || '',
        media: alchemyNFT.data.media || [],
        attributes: alchemyNFT.data.metadata?.attributes || []
      },
      collectionStats: {
        totalSupply: parseInt(etherscanSupply.data.result, 10) || 10000,
        floorPrice: alchemyFloor.data.openSea?.floorPrice || 0,
        contractName: alchemyNFT.data.contractMetadata?.name || 'Unknown Collection'
      },
      marketData: {
        recentSales: etherscanTxs.data.result || [],
        lastSalePrice: 0
      },
      onChainData: {
        contractAddress,
        tokenId,
        tokenType: alchemyNFT.data.id?.tokenMetadata?.tokenType || 'ERC721'
      }
    };

    
    if (result.marketData.recentSales.length > 0) {
      const lastSale = result.marketData.recentSales.find((tx: any) => 
        tx.tokenID === tokenId && tx.value !== "0"
      );
      if (lastSale) {
        result.marketData.lastSalePrice = parseFloat(lastSale.value) / 1e18;
      }
    }

    return result;

  } catch (error: any) {
    console.error("❌ Data Collection Agent: Failed to gather complete data", error.message);
    throw new Error("Data collection failed: " + error.message);
  }
}