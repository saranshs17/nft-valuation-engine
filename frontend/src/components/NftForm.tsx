import React, { useState } from 'react';
import './NftForm.css';

interface NftFormProps {
  onValuation: (contractAddress: string, tokenId: string) => void;
  loading: boolean;
}

const EXAMPLE_NFTS = [
  { contract: '0xf613053f5f99d3f8740c3383ef23cd994945e2a3', tokenId: '17', name: 'Test NFT #17' },
  { contract: '0x5F9872cb8A963eb21CebdDD17DB5d0f6f8008c4C', tokenId: '4', name: 'Test NFT #4' },
  { contract: '0xb7b9C5BFfAAC1Be1C23D75b4AE9fa7B3e60b0d90', tokenId: '373', name: 'Test NFT #373' },
];

export function NftForm({ onValuation, loading }: NftFormProps) {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [errors, setErrors] = useState({ contract: '', token: '' });

  const validateForm = () => {
    const newErrors = { contract: '', token: '' };

    if (!contractAddress) {
      newErrors.contract = 'Contract address is required';
    } else if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      newErrors.contract = 'Invalid contract address format';
    }

    if (!tokenId) {
      newErrors.token = 'Token ID is required';
    } else if (isNaN(Number(tokenId))) {
      newErrors.token = 'Token ID must be a number';
    }

    setErrors(newErrors);
    return !newErrors.contract && !newErrors.token;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onValuation(contractAddress, tokenId);
    }
  };

  const handleExampleClick = (example: typeof EXAMPLE_NFTS[0]) => {
    setContractAddress(example.contract);
    setTokenId(example.tokenId);
    setErrors({ contract: '', token: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="nft-form">
      <div className="form-group">
        <label className="form-label">NFT Details</label>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Contract Address (0x...)"
            value={contractAddress}
            onChange={(e) => {
              setContractAddress(e.target.value);
              setErrors(prev => ({ ...prev, contract: '' }));
            }}
            className={`form-input ${errors.contract ? 'error' : ''}`}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Token ID"
            value={tokenId}
            onChange={(e) => {
              setTokenId(e.target.value);
              setErrors(prev => ({ ...prev, token: '' }));
            }}
            className={`form-input token-input ${errors.token ? 'error' : ''}`}
            disabled={loading}
          />
        </div>
        {errors.contract && <div className="form-helper error">{errors.contract}</div>}
        {errors.token && <div className="form-helper error">{errors.token}</div>}
      </div>

      <button type="submit" disabled={loading} className="submit-button">
        <div className="button-content">
          {loading ? (
            <>
              <span>Analyzing</span>
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
            </>
          ) : (
            <>
              <span className="button-icon">🚀</span>
              <span>Start Valuation</span>
            </>
          )}
        </div>
      </button>

      <div className="examples-section">
        <div className="examples-title">Try Example NFTs</div>
        <div className="example-chips">
          {EXAMPLE_NFTS.map((example, index) => (
            <button
              key={index}
              type="button"
              className="example-chip"
              onClick={() => handleExampleClick(example)}
              disabled={loading}
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}