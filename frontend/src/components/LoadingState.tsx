import React, { useEffect, useState } from 'react';
import './LoadingState.css';
import { LoadingPhase } from '../App';

interface LoadingStateProps {
  phase: LoadingPhase;
}

interface AgentStatus {
  name: string;
  icon: string;
  status: 'waiting' | 'active' | 'complete';
}

export function LoadingState({ phase }: LoadingStateProps) {
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: 'Data Collection Agent', icon: '📊', status: 'waiting' },
    { name: 'Valuation Agent', icon: '💎', status: 'waiting' },
    { name: 'Market Analysis Agent', icon: '📈', status: 'waiting' },
    { name: 'Blockchain Agent', icon: '⛓️', status: 'waiting' }
  ]);

  useEffect(() => {
    const updateAgentStatus = () => {
      switch (phase.phase) {
        case 'collecting':
          setAgents(prev => prev.map((agent, idx) => 
            ({ ...agent, status: idx === 0 ? 'active' : 'waiting' })
          ));
          break;
        case 'analyzing':
          setAgents(prev => prev.map((agent, idx) => 
            ({ ...agent, status: idx === 0 ? 'complete' : idx <= 2 ? 'active' : 'waiting' })
          ));
          break;
        case 'blockchain':
          setAgents(prev => prev.map((agent, idx) => 
            ({ ...agent, status: idx < 3 ? 'complete' : 'active' })
          ));
          break;
        case 'complete':
          setAgents(prev => prev.map(agent => 
            ({ ...agent, status: 'complete' })
          ));
          break;
      }
    };

    updateAgentStatus();
  }, [phase]);

  return (
    <div className="loading-state">
      <div className="loading-header">
                <h3>JuliaOS Agent Swarm Active</h3>
        <p>{phase.message}</p>
      </div>

      <div className="agents-grid">
        {agents.map((agent, index) => (
          <div 
            key={index} 
            className={`agent-card ${agent.status}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="agent-icon">{agent.icon}</div>
            <div className="agent-info">
              <h4>{agent.name}</h4>
              <div className="agent-status">
                {agent.status === 'active' && <span className="status-dot active"></span>}
                {agent.status === 'complete' && <span className="status-check">✓</span>}
                <span className="status-text">
                  {agent.status === 'waiting' && 'Waiting...'}
                  {agent.status === 'active' && 'Processing...'}
                  {agent.status === 'complete' && 'Complete'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${phase.progress}%` }}
          ></div>
          <div className="progress-glow"></div>
        </div>
        <span className="progress-text">{phase.progress}% Complete</span>
      </div>

      <div className="loading-animation">
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
        <div className="pulse-ring"></div>
      </div>
    </div>
  );
}