import React from 'react';
import './MarketInsights.css';

interface MarketInsightsProps {
  analysis: {
    trend: string;
    volatility: string;
    liquidityScore: number;
    recommendation: string;
  };
  factors: {
    rarity: number;
    market: number;
    utility: number;
    trend: number;
  };
}

export function MarketInsights({ analysis, factors }: MarketInsightsProps) {
  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      default: return '➡️';
    }
  };

  const getVolatilityIcon = (volatility: string) => {
    switch(volatility) {
      case 'high': return '⚡';
      case 'medium': return '〰️';
      default: return '━';
    }
  };

  const formatFactorScore = (score: number) => {
    return (score * 50).toFixed(0); 
  };

  const getRecommendationTag = () => {
    if (analysis.trend === 'bullish' && analysis.volatility !== 'high') {
      return { text: 'Buy Signal', icon: '🟢' };
    } else if (analysis.trend === 'bearish') {
      return { text: 'Hold', icon: '🟡' };
    }
    return { text: 'Monitor', icon: '👁️' };
  };

  const tag = getRecommendationTag();

  return (
    <div className="market-insights">
      <div className="insights-header">
        <h3>AI Agent Analysis</h3>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <span className="insight-icon">{getTrendIcon(analysis.trend)}</span>
          <div className="insight-title">Market Trend</div>
          <div className={`insight-value trend-${analysis.trend}`}>
            {analysis.trend.toUpperCase()}
          </div>
        </div>

        <div className="insight-card">
          <span className="insight-icon">{getVolatilityIcon(analysis.volatility)}</span>
          <div className="insight-title">Volatility</div>
          <div className="insight-value">
            {analysis.volatility.toUpperCase()}
          </div>
        </div>

        <div className="insight-card">
          <span className="insight-icon">💧</span>
          <div className="insight-title">Liquidity Score</div>
          <div className="insight-value">
            {analysis.liquidityScore.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="factors-visualization">
        <div className="factors-header">
          <h4>Valuation Factors Analysis</h4>
          <div className="factors-legend">
            <span>0</span>
            <span>•</span>
            <span>100</span>
          </div>
        </div>
        <div className="factors-chart">
          {Object.entries(factors).map(([key, value]) => (
            <div key={key} className="factor-row">
              <div className="factor-label">{key}</div>
              <div className="factor-bar-container">
                <div 
                  className="factor-bar-fill" 
                  style={{ width: `${formatFactorScore(value)}%` }}
                >
                  <div className="factor-bar-glow"></div>
                </div>
              </div>
              <div className="factor-score">{formatFactorScore(value)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-recommendation">
        <div className="recommendation-header">
          <span className="recommendation-icon">🧠</span>
          <h4>AI Recommendation</h4>
        </div>
        <p className="recommendation-text">{analysis.recommendation}</p>
        <div className="recommendation-tag">
          <span>{tag.icon}</span>
          <span>{tag.text}</span>
        </div>
      </div>
    </div>
  );
}