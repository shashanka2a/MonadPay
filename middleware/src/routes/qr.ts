import { Router } from 'express';
import { qrService } from '../services/qrService';
import QRCode from 'qrcode';

const router = Router();

/**
 * POST /api/qr/generate
 * Generate QR code for payment request
 */
router.post('/generate', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'payment-request') {
      const qrData = qrService.encodePaymentRequest(data);
      const qrCode = await QRCode.toDataURL(qrData);
      
      return res.json({
        type: 'payment-request',
        data: qrData,
        qrCode,
        decoded: data,
      });
    }
    
    if (type === 'handle') {
      const qrData = qrService.encodeHandle(data.handle);
      const qrCode = await QRCode.toDataURL(qrData);
      
      return res.json({
        type: 'handle',
        data: qrData,
        qrCode,
        decoded: { handle: data.handle },
      });
    }
    
    res.status(400).json({ 
      error: 'Invalid QR type. Use "payment-request" or "handle"' 
    });
  } catch (error: any) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ 
      error: 'Failed to generate QR code',
      message: error.message 
    });
  }
});

/**
 * POST /api/qr/decode
 * Decode QR code data
 */
router.post('/decode', async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({ 
        error: 'QR data is required' 
      });
    }
    
    const decoded = qrService.decodeQR(qrData);
    
    res.json({
      decoded,
      type: decoded.type,
    });
  } catch (error: any) {
    console.error('Error decoding QR code:', error);
    res.status(400).json({ 
      error: 'Failed to decode QR code',
      message: error.message 
    });
  }
});

export { router as qrRoutes };


