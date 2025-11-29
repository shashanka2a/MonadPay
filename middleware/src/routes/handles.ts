import { Router } from 'express';
import { handleService } from '../services/handleService';
import { z } from 'zod';

const router = Router();

const handleCheckSchema = z.object({
  handle: z.string().min(2).max(30),
});

/**
 * GET /api/handles/check/:handle
 * Check if a handle is available
 */
router.get('/check/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    
    const validation = handleCheckSchema.safeParse({ handle });
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid handle format',
        details: validation.error.errors 
      });
    }
    
    const result = await handleService.checkAvailability(handle);
    
    res.json({
      handle,
      available: result.available,
      message: result.available 
        ? 'Handle is available' 
        : 'Handle is already taken',
    });
  } catch (error: any) {
    console.error('Error checking handle:', error);
    res.status(500).json({ 
      error: 'Failed to check handle availability',
      message: error.message 
    });
  }
});

/**
 * GET /api/handles/address/:handle
 * Get wallet address for a handle
 */
router.get('/address/:handle', async (req, res) => {
  try {
    const { handle } = req.params;
    const address = await handleService.getAddressByHandle(handle);
    
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return res.status(404).json({ 
        error: 'Handle not found' 
      });
    }
    
    res.json({
      handle,
      address,
    });
  } catch (error: any) {
    console.error('Error getting address:', error);
    res.status(500).json({ 
      error: 'Failed to get address',
      message: error.message 
    });
  }
});

/**
 * GET /api/handles/handle/:address
 * Get handle for a wallet address
 */
router.get('/handle/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ 
        error: 'Invalid address format' 
      });
    }
    
    const handle = await handleService.getHandleByAddress(address);
    
    if (!handle || handle === '') {
      return res.status(404).json({ 
        error: 'No handle found for this address' 
      });
    }
    
    res.json({
      address,
      handle,
    });
  } catch (error: any) {
    console.error('Error getting handle:', error);
    res.status(500).json({ 
      error: 'Failed to get handle',
      message: error.message 
    });
  }
});

/**
 * GET /api/handles/user/:address
 * Get complete user info (handle + address)
 */
router.get('/user/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ 
        error: 'Invalid address format' 
      });
    }
    
    const userInfo = await handleService.getUserInfo(address);
    
    res.json(userInfo);
  } catch (error: any) {
    console.error('Error getting user info:', error);
    res.status(500).json({ 
      error: 'Failed to get user info',
      message: error.message 
    });
  }
});

export { router as handleRoutes };


