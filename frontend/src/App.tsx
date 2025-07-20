import React, { useState, useEffect } from 'react';
import './App.css';
import { NftForm } from './components/NftForm';
import { ResultDisplay } from './components/ResultDisplay';

export interface NftData {
  name: string;
  imageUrl: string;
  valuation: number;
  collectionName: string;
}

function App() {
  const [nftData, setNftData] = useState<NftData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (nftData || error) {
      setIsFinished(true);
    }
  }, [nftData, error]);

  const handleValuation = async (contractAddress: string, tokenId: string) => {
    setLoading(true);
    setError(null);
    setNftData(null);
    setIsFinished(false);

    try {
      const alchemyApiKey = process.env.REACT_APP_ALCHEMY_API_KEY;
      if (!alchemyApiKey) {
        throw new Error("Alchemy API key is not configured in the frontend .env file.");
      }
      
      const alchemyUrl = `https://eth-sepolia.g.alchemy.com/nft/v2/${alchemyApiKey}/getNFTMetadata`;
      
      const metadataPromise = fetch(`${alchemyUrl}?contractAddress=${contractAddress}&tokenId=${tokenId}`)
        .then(res => res.json());

      const valuationPromise = fetch('http://localhost:3001/api/valuate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAddress, tokenId }),
      }).then(res => {
        if (!res.ok) throw new Error("Valuation request failed");
        return res.json();
      });

      const [metadata, valuationResult] = await Promise.all([metadataPromise, valuationPromise]);

      const getImageUrl = (meta: any) => {
        return meta.media?.[0]?.gateway || meta.contract?.openSea?.imageUrl || 'https://via.placeholder.com/300';
      };

      setNftData({
        name: metadata.title || 'Unnamed NFT',
        collectionName: metadata.contract?.name || 'Unknown Collection',
        imageUrl: getImageUrl(metadata),
        valuation: valuationResult.valuation,
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="background-grid"></div>
      <div className="gradient-bg"></div>
      
      <main className="container">
        <header className="app-header">
          <h1>NFT Valuation Engine</h1>
          <p>An AI-powered dApp built on the JuliaOS Framework</p>
        </header>
        
        <div className="card">
          <NftForm onValuation={handleValuation} loading={loading} />
        </div>

        <div className={`result-container ${isFinished ? 'visible' : ''}`}>
          {loading && <div className="spinner"></div>}
          {error && <div className="error-message"><span>!</span> {error}</div>}
          {nftData && <ResultDisplay data={nftData} />}
        </div>
      </main>
    </div>
  );
}

export default App;