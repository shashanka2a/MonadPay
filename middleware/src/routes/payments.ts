import { Router } from 'express';
import { paymentService } from '../services/paymentService';
import { z } from 'zod';

const router = Router();

const sendPaymentSchema = z.object({
  from: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  toHandle: z.string().min(2).max(30).optional(),
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  amount: z.string().regex(/^\d+(\.\d+)?$/),
  note: z.string().optional(),
  signature: z.string().optional(), // For signed transactions
});

/**
 * POST /api/payments/send
 * Prepare payment transaction data
 */
router.post('/send', async (req, res) => {
  try {
    const validation = sendPaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid payment data',
        details: validation.error.errors 
      });
    }
    
    const { from, toHandle, toAddress, amount, note } = validation.data;
    
    // Must have either handle or address
    if (!toHandle && !toAddress) {
      return res.status(400).json({ 
        error: 'Must provide either toHandle or toAddress' 
      });
    }
    
    const result = await paymentService.preparePayment({
      from,
      toHandle,
      toAddress,
      amount,
      note: note || '',
    });
    
    res.json(result);
  } catch (error: any) {
    console.error('Error preparing payment:', error);
    res.status(500).json({ 
      error: 'Failed to prepare payment',
      message: error.message 
    });
  }
});

/**
 * GET /api/payments/balance/:address
 * Get balance for an address
 */
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ 
        error: 'Invalid address format' 
      });
    }
    
    const balance = await paymentService.getBalance(address);
    
    res.json({
      address,
      balance: balance.toString(),
      balanceWei: balance.toString(),
    });
  } catch (error: any) {
    console.error('Error getting balance:', error);
    res.status(500).json({ 
      error: 'Failed to get balance',
      message: error.message 
    });
  }
});

export { router as paymentRoutes };

