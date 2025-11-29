import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleRoutes } from './routes/handles';
import { paymentRoutes } from './routes/payments';
import { requestRoutes } from './routes/requests';
import { transactionRoutes } from './routes/transactions';
import { qrRoutes } from './routes/qr';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/handles', handleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/qr', qrRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 MonadPay Middleware API running on port ${PORT}`);
  console.log(`📡 RPC URL: ${process.env.MONAD_RPC_URL || 'Not configured'}`);
});

