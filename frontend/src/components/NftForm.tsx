import React, { useState } from 'react';
import './NftForm.css';

interface NftFormProps {
  onValuation: (contractAddress: string, tokenId: string) => void;
  loading: boolean;
}

export function NftForm({ onValuation, loading }: NftFormProps) {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractAddress || !tokenId) {
      alert("Please provide both a contract address and a token ID.");
      return;
    }
    onValuation(contractAddress, tokenId);
  };

  return (
    <form onSubmit={handleSubmit} className="nft-form">
      <div className="input-group">
        <input
          type="text"
          placeholder="NFT Contract Address (Sepolia)"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Token ID"
          className="token-id-input"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Valuating...' : 'Get Valuation'}
      </button>
    </form>
  );
}