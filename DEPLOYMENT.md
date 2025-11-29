# monadpay Deployment Guide

Complete guide for deploying monadpay smart contracts and middleware.

## Prerequisites

1. **Monad Blockchain Access**
   - RPC endpoint URL
   - Testnet/mainnet access
   - MON tokens for gas fees

2. **Development Tools**
   - Node.js 18+
   - Solidity compiler (solc) or Hardhat
   - Wallet with MON for deployment

3. **Environment Setup**
   - Configure `.env` files
   - Set contract addresses after deployment

## Deployment Steps

### 1. Deploy Smart Contracts

#### Step 1.1: Deploy HandleRegistry

```bash
# Using Hardhat or your preferred tool
npx hardhat deploy --contract HandleRegistry
# or
# Deploy via Remix, Foundry, etc.
```

**Contract:** `contracts/HandleRegistry.sol`  
**Constructor:** No parameters  
**Save Address:** Update `HANDLE_REGISTRY_ADDRESS` in middleware `.env`

#### Step 1.2: Deploy Payment Contract

```bash
# Deploy with HandleRegistry address
npx hardhat deploy --contract Payment --args <HANDLE_REGISTRY_ADDRESS>
```

**Contract:** `contracts/Payment.sol`  
**Constructor:** `address _handleRegistry`  
**Save Address:** Update `PAYMENT_CONTRACT_ADDRESS` in middleware `.env`

#### Step 1.3: Deploy PaymentRequest Contract

```bash
# Deploy with HandleRegistry address
npx hardhat deploy --contract PaymentRequest --args <HANDLE_REGISTRY_ADDRESS>
```

**Contract:** `contracts/PaymentRequest.sol`  
**Constructor:** `address _handleRegistry`  
**Save Address:** Update `PAYMENT_REQUEST_CONTRACT_ADDRESS` in middleware `.env`

### 2. Setup Middleware

#### Step 2.1: Install Dependencies

```bash
cd middleware
npm install
```

#### Step 2.2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
MONAD_RPC_URL=https://your-monad-rpc-url.com
HANDLE_REGISTRY_ADDRESS=0x...
PAYMENT_CONTRACT_ADDRESS=0x...
PAYMENT_REQUEST_CONTRACT_ADDRESS=0x...
PORT=3001
```

#### Step 2.3: Start Middleware

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### 3. Update Frontend

Update your Next.js app to use the middleware API:

```typescript
// src/utils/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  checkHandle: (handle: string) => 
    fetch(`${API_BASE_URL}/api/handles/check/${handle}`),
  // ... other endpoints
};
```

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Contract Interaction Flow

### Handle Claiming Flow

1. User calls `claimHandle("alice")` with 0.001 MON
2. HandleRegistry validates and stores mapping
3. Frontend queries middleware: `GET /api/handles/check/alice`
4. Middleware queries contract: `isHandleAvailable("alice")`

### Payment Flow

1. User enters handle and amount in Send Screen
2. Frontend calls: `POST /api/payments/send`
3. Middleware resolves handle to address
4. Returns transaction data
5. Frontend signs and sends transaction
6. Payment contract emits events
7. Success screen shows transaction hash

### Payment Request Flow

1. User creates request: `POST /api/requests/create`
2. Middleware returns request ID and QR data
3. Frontend generates QR code
4. Recipient scans QR
5. QR decoded → Send screen pre-filled
6. Recipient fulfills request

## Testing

### Test Handle Registry

```bash
# Check handle availability
curl http://localhost:3001/api/handles/check/alice

# Get address for handle
curl http://localhost:3001/api/handles/address/alice
```

### Test Payments

```bash
# Prepare payment
curl -X POST http://localhost:3001/api/payments/send \
  -H "Content-Type: application/json" \
  -d '{
    "from": "0x...",
    "toHandle": "alice",
    "amount": "0.1",
    "note": "Test payment"
  }'
```

### Test QR Generation

```bash
curl -X POST http://localhost:3001/api/qr/generate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment-request",
    "data": {
      "requester": "0x...",
      "requesterHandle": "alice",
      "amount": "0.1",
      "note": "Dinner split"
    }
  }'
```

## Production Checklist

- [ ] Deploy contracts to Monad mainnet
- [ ] Verify contracts on block explorer
- [ ] Configure production RPC URL
- [ ] Set up middleware on server/cloud
- [ ] Configure CORS for frontend domain
- [ ] Set up monitoring/logging
- [ ] Configure rate limiting
- [ ] Set up database for transaction indexing (optional)
- [ ] Test all flows end-to-end
- [ ] Update frontend API URLs

## Security Notes

1. **Contract Security**
   - Review all contracts before deployment
   - Consider audits for mainnet
   - Test thoroughly on testnet first

2. **Middleware Security**
   - Use HTTPS in production
   - Implement rate limiting
   - Validate all inputs
   - Use environment variables for secrets

3. **Frontend Security**
   - Never expose private keys
   - Use wallet connection (MetaMask, etc.)
   - Validate all user inputs
   - Sanitize QR code data

## Troubleshooting

### Contract Deployment Issues

- **Insufficient Gas:** Ensure wallet has enough MON
- **Invalid Address:** Verify HandleRegistry address is correct
- **Compilation Errors:** Check Solidity version compatibility

### Middleware Issues

- **Connection Errors:** Verify RPC URL is accessible
- **Contract Not Found:** Check contract addresses in `.env`
- **Type Errors:** Ensure ABI matches deployed contract

### Integration Issues

- **CORS Errors:** Configure CORS in middleware
- **API Timeouts:** Check RPC endpoint performance
- **Transaction Failures:** Verify user has sufficient balance

## Support

For issues or questions:
1. Check contract READMEs
2. Review middleware logs
3. Verify environment configuration
4. Test with curl/Postman first

