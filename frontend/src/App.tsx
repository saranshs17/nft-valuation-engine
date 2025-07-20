import React, { useState, useEffect } from 'react';
import './App.css';
import { NftForm } from './components/NftForm';
import { ResultDisplay } from './components/ResultDisplay';
import { MarketInsights } from './components/MarketInsights';
import { LoadingState } from './components/LoadingState';
import { Header } from './components/Header';

export interface SwarmData {
  valuation: number;
  confidence: number;
  factors: {
    rarity: number;
    market: number;
    utility: number;
    trend: number;
  };
  marketAnalysis: {
    trend: string;
    volatility: string;
    liquidityScore: number;
    recommendation: string;
  };
  metadata: {
    name: string;
    imageUrl: string;
    collection: string;
    attributes: any[];
  };
}

export interface LoadingPhase {
  phase: 'idle' | 'collecting' | 'analyzing' | 'blockchain' | 'complete';
  message: string;
  progress: number;
}

function App() {
  const [swarmData, setSwarmData] = useState<SwarmData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>({
    phase: 'idle',
    message: '',
    progress: 0
  });

  useEffect(() => {
    if (swarmData || error) {
      setIsFinished(true);
      setLoadingPhase({ phase: 'complete', message: 'Analysis complete!', progress: 100 });
    }
  }, [swarmData, error]);

  const simulateLoadingPhases = () => {
    const phases = [
      { phase: 'collecting' as const, message: 'Data Collection Agent gathering NFT data...', progress: 25, duration: 2000 },
      { phase: 'analyzing' as const, message: 'Valuation & Market Agents analyzing...', progress: 60, duration: 2000 },
      { phase: 'blockchain' as const, message: 'Recording valuation on blockchain...', progress: 90, duration: 1500 }
    ];

    phases.forEach((phase, index) => {
      setTimeout(() => {
        if (loading) {
          setLoadingPhase(phase);
        }
      }, phases.slice(0, index).reduce((acc, p) => acc + p.duration, 0));
    });
  };

  const handleValuation = async (contractAddress: string, tokenId: string) => {
    setLoading(true);
    setError(null);
    setSwarmData(null);
    setIsFinished(false);
    setLoadingPhase({ phase: 'collecting', message: 'Initializing JuliaOS agents...', progress: 10 });

    simulateLoadingPhases();

    try {
      const response = await fetch('http://localhost:3001/api/valuate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAddress, tokenId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Valuation request failed");
      }

      const result = await response.json();
      setSwarmData(result);

    } catch (err: any) {
      setError(err.message);
      setLoadingPhase({ phase: 'idle', message: '', progress: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="animated-background">
        <div className="grid-overlay"></div>
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
      </div>
      
      <Header />
      
      <main className="main-container">
        <div className="content-wrapper">
          <div className="form-section">
            <div className="glass-card">
              <h2 className="card-title">
                <span className="title-icon">🔍</span>
                Analyze NFT Value
              </h2>
              <p className="card-description">
                Enter an NFT contract address and token ID to activate our multi-agent swarm
              </p>
              <NftForm onValuation={handleValuation} loading={loading} />
            </div>
          </div>

          {(loading || isFinished) && (
            <div className={`results-section ${isFinished ? 'visible' : ''}`}>
              {loading && <LoadingState phase={loadingPhase} />}
              
              {error && (
                <div className="error-container animate-in">
                  <div className="error-icon">⚠️</div>
                  <div className="error-content">
                    <h3>Analysis Failed</h3>
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {swarmData && !loading && (
                <div className="results-grid animate-in">
                  <ResultDisplay data={swarmData} />
                  <MarketInsights analysis={swarmData.marketAnalysis} factors={swarmData.factors} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by JuliaOS Multi-Agent Framework</p>
      </footer>
    </div>
  );
}

export default App;