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
    const valuation = await juliaosService.getValuation(contractAddress, tokenId);
    res.json({ valuation });
  } catch (error) {
    console.error('Valuation Error:', error);
    res.status(500).json({ error: 'Failed to get valuation.' });
  }
});