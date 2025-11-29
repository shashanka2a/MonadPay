# monadpay Middleware API

Middleware API server for monadpay payment application. Provides REST endpoints for interacting with Monad blockchain smart contracts.

## Features

- ✅ Handle Registry API (check availability, resolve handles to addresses)
- ✅ Payment API (prepare transactions, get balances)
- ✅ Payment Request API (create, validate, fulfill requests)
- ✅ Transaction API (query transaction history)
- ✅ QR Code API (generate and decode QR codes)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
   - `MONAD_RPC_URL` - Monad blockchain RPC endpoint
   - `HANDLE_REGISTRY_ADDRESS` - Deployed HandleRegistry contract address
   - `PAYMENT_CONTRACT_ADDRESS` - Deployed Payment contract address
   - `PAYMENT_REQUEST_CONTRACT_ADDRESS` - Deployed PaymentRequest contract address

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Endpoints

### Handles

- `GET /api/handles/check/:handle` - Check if handle is available
- `GET /api/handles/address/:handle` - Get address for a handle
- `GET /api/handles/handle/:address` - Get handle for an address
- `GET /api/handles/user/:address` - Get complete user info

### Payments

- `POST /api/payments/send` - Prepare payment transaction
- `GET /api/payments/balance/:address` - Get balance for address

### Requests

- `POST /api/requests/create` - Create payment request
- `GET /api/requests/:requestId` - Get request details
- `GET /api/requests/user/:address` - Get user's requests
- `GET /api/requests/:requestId/validate` - Validate request

### Transactions

- `GET /api/transactions/:txHash` - Get transaction details
- `GET /api/transactions/user/:address` - Get user transactions
- `GET /api/transactions/user/:address/summary` - Get transaction summary

### QR Codes

- `POST /api/qr/generate` - Generate QR code
- `POST /api/qr/decode` - Decode QR code data

## Smart Contracts

The middleware interacts with three main smart contracts:

1. **HandleRegistry** - Manages handle (@username) to wallet address mappings
2. **Payment** - Handles MON token transfers between users
3. **PaymentRequest** - Manages payment requests (QR codes)

See `/contracts` directory for Solidity source code.

## Development

The middleware uses:
- **Express.js** - Web framework
- **ethers.js** - Ethereum/Monad blockchain interaction
- **TypeScript** - Type safety
- **Zod** - Request validation

## License

MIT

