import { Router } from 'express';
import { requestService } from '../services/requestService';
import { z } from 'zod';

const router = Router();

const createRequestSchema = z.object({
  requester: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amount: z.string().regex(/^\d+(\.\d+)?$/),
  note: z.string().optional(),
  expiry: z.number().optional(),
});

/**
 * POST /api/requests/create
 * Create a payment request
 */
router.post('/create', async (req, res) => {
  try {
    const validation = createRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validation.error.errors 
      });
    }
    
    const { requester, amount, note, expiry } = validation.data;
    
    const result = await requestService.createRequest({
      requester,
      amount,
      note: note || '',
      expiry: expiry || 0,
    });
    
    res.json(result);
  } catch (error: any) {
    console.error('Error creating request:', error);
    res.status(500).json({ 
      error: 'Failed to create payment request',
      message: error.message 
    });
  }
});

/**
 * GET /api/requests/:requestId
 * Get payment request details
 */
router.get('/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    if (!/^0x[a-fA-F0-9]{64}$/.test(requestId)) {
      return res.status(400).json({ 
        error: 'Invalid request ID format' 
      });
    }
    
    const request = await requestService.getRequest(requestId);
    
    if (!request) {
      return res.status(404).json({ 
        error: 'Request not found' 
      });
    }
    
    res.json(request);
  } catch (error: any) {
    console.error('Error getting request:', error);
    res.status(500).json({ 
      error: 'Failed to get request',
      message: error.message 
    });
  }
});

/**
 * GET /api/requests/user/:address
 * Get all requests for a user
 */
router.get('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ 
        error: 'Invalid address format' 
      });
    }
    
    const requests = await requestService.getUserRequests(address);
    
    res.json({
      address,
      requests,
      count: requests.length,
    });
  } catch (error: any) {
    console.error('Error getting user requests:', error);
    res.status(500).json({ 
      error: 'Failed to get user requests',
      message: error.message 
    });
  }
});

/**
 * GET /api/requests/:requestId/validate
 * Validate if a request is still valid
 */
router.get('/:requestId/validate', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const isValid = await requestService.validateRequest(requestId);
    
    res.json({
      requestId,
      valid: isValid,
    });
  } catch (error: any) {
    console.error('Error validating request:', error);
    res.status(500).json({ 
      error: 'Failed to validate request',
      message: error.message 
    });
  }
});

export { router as requestRoutes };



