import React from 'react';
import './ResultDisplay.css';
import { NftData } from '../App'; 

interface ResultDisplayProps {
  data: NftData;
}

export function ResultDisplay({ data }: ResultDisplayProps) {
  return (
    <div className="result-card">
      <img src={data.imageUrl} alt={data.name} className="nft-image" />
      <div className="nft-info">
        <h3 className="nft-name">{data.name}</h3>
        <div className="valuation-display">
          <span className="valuation-label">Estimated Value</span>
          <span className="valuation-value">{data.valuation.toFixed(4)} ETH</span>
        </div>
      </div>
    </div>
  );
}