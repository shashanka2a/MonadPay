import { Router } from 'express';
import { transactionService } from '../services/transactionService';

const router = Router();

/**
 * GET /api/transactions/:txHash
 * Get transaction details by hash
 */
router.get('/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return res.status(400).json({ 
        error: 'Invalid transaction hash format' 
      });
    }
    
    const transaction = await transactionService.getTransaction(txHash);
    
    if (!transaction) {
      return res.status(404).json({ 
        error: 'Transaction not found' 
      });
    }
    
    res.json(transaction);
  } catch (error: any) {
    console.error('Error getting transaction:', error);
    res.status(500).json({ 
      error: 'Failed to get transaction',
      message: error.message 
    });
  }
});

/**
 * GET /api/transactions/user/:address
 * Get all transactions for a user
 */
router.get('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = '50', offset = '0', type } = req.query;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ 
        error: 'Invalid address format' 
      });
    }
    
    const transactions = await transactionService.getUserTransactions(
      address,
      parseInt(limit as string),
      parseInt(offset as string),
      type as 'sent' | 'received' | 'all' | undefined
    );
    
    res.json({
      address,
      transactions,
      count: transactions.length,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    console.error('Error getting user transactions:', error);
    res.status(500).json({ 
      error: 'Failed to get transactions',
      message: error.message 
    });
  }
});

/**
 * GET /api/transactions/user/:address/summary
 * Get transaction summary for a user
 */
router.get('/user/:address/summary', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ 
        error: 'Invalid address format' 
      });
    }
    
    const summary = await transactionService.getUserSummary(address);
    
    res.json(summary);
  } catch (error: any) {
    console.error('Error getting transaction summary:', error);
    res.status(500).json({ 
      error: 'Failed to get transaction summary',
      message: error.message 
    });
  }
});

export { router as transactionRoutes };

