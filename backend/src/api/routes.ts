import { Router } from 'express';
import { JuliaosService } from '../services/juliaos-service';

export const router = Router();
const juliaosService = new JuliaosService();

router.post('/valuate', async (req, res) => {
  try {
    const { contractAddress, tokenId } = req.body;
    if (!contractAddress || !tokenId) {
      return res.status(400).json({ error: 'Contract address and token ID are required.' });
    }
    
    const swarmResult = await juliaosService.runSwarmValuation(contractAddress, tokenId);
    res.json(swarmResult);
    
  } catch (error: any) {
    console.error('Swarm Execution Error:', error);
    res.status(500).json({ error: error.message || 'Failed to execute valuation swarm.' });
  }
});

router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'JuliaOS NFT Valuation Engine',
    agents: ['data-collection', 'valuation', 'market-analysis']
  });
});