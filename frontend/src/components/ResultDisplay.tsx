import React from 'react';
import './ResultDisplay.css';
import { SwarmData } from '../App';

interface ResultDisplayProps {
  data: SwarmData;
}

const DEFAULT_NFT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUExQTFBIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHN0cm9rZT0iIzAwRjVBMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik0xNTAgMTAwVjIwME0xMDAgMTUwSDIwMCIgc3Ryb2tlPSIjMDBGNUEwIiBzdHJva2Utd2lkdGg9IjIiLz4KPHRleHQgeD0iMTUwIiB5PSIyNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4ODg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TkZUIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';

export function ResultDisplay({ data }: ResultDisplayProps) {
  const { metadata, valuation, confidence } = data;
  
  const getConfidenceColor = () => {
    if (confidence >= 80) return '#00F5A0';
    if (confidence >= 60) return '#FFD93D';
    return '#FF6B6B';
  };

  const getConfidenceLabel = () => {
    if (confidence >= 80) return 'High Confidence';
    if (confidence >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <div className="result-display">
      <div className="result-header">
        <h3 className="result-title">
          <span className="title-icon">💎</span>
          Valuation Results
        </h3>
      </div>

      <div className="nft-showcase">
        <div className="nft-image-container">
          <img 
            src={metadata.imageUrl || DEFAULT_NFT_IMAGE} 
            alt={metadata.name} 
            className="nft-image"
            onError={(e: any) => {
              e.target.src = DEFAULT_NFT_IMAGE;
            }}
          />
          <div className="nft-glow"></div>
        </div>

        <div className="nft-details">
          <div className="collection-badge">
            {metadata.collection}
          </div>
          <h2 className="nft-name">{metadata.name}</h2>
          
          <div className="valuation-section">
            <div className="valuation-label">Estimated Value</div>
            <div className="valuation-amount">
              <span className="eth-value">{valuation.toFixed(4)}</span>
              <span className="eth-symbol">ETH</span>
            </div>
            <div className="usd-value">≈ ${(valuation * 3000).toFixed(2)} USD</div>
          </div>

          <div className="confidence-section">
            <div className="confidence-header">
              <span>Analysis Confidence</span>
              <span className="confidence-badge" style={{ color: getConfidenceColor() }}>
                {getConfidenceLabel()}
              </span>
            </div>
            <div className="confidence-bar-wrapper">
              <div className="confidence-bar">
                <div 
                  className="confidence-fill" 
                  style={{ 
                    width: `${confidence}%`,
                    background: getConfidenceColor()
                  }}
                >
                  <div className="confidence-glow"></div>
                </div>
              </div>
              <span className="confidence-percentage">{confidence}%</span>
            </div>
          </div>

          {metadata.attributes && metadata.attributes.length > 0 && (
            <div className="attributes-preview">
              <div className="attributes-label">Key Traits</div>
              <div className="attributes-list">
                {metadata.attributes.slice(0, 3).map((attr: any, index: number) => (
                  <div key={index} className="attribute-chip">
                    <span className="trait-type">{attr.trait_type}</span>
                    <span className="trait-value">{attr.value}</span>
                  </div>
                ))}
                {metadata.attributes.length > 3 && (
                  <div className="attribute-chip more">
                    +{metadata.attributes.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}