# MonadPay Architecture

Complete system architecture for MonadPay payment application.

## System Overview

```
┌─────────────────┐
│   Next.js App   │  (Frontend - React/TypeScript)
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Middleware API │  (Express/TypeScript)
│   (Port 3001)   │
└────────┬────────┘
         │ JSON-RPC
         │
┌────────▼────────┐
│ Monad Blockchain│  (Smart Contracts)
│   (RPC Node)    │
└─────────────────┘
```

## Component Breakdown

### 1. Frontend (Next.js App)

**Location:** `/app` and `/src`

**Responsibilities:**
- User interface and interactions
- Wallet connection (MetaMask, WalletConnect)
- Transaction signing
- QR code display/scanning
- State management

**Key Screens:**
- Splash → Tutorial → Onboarding
- Home, Send, Request, Activity, Settings
- Confirm, Success, Transaction Detail
- QR Scanner

### 2. Middleware API

**Location:** `/middleware`

**Responsibilities:**
- Bridge between frontend and blockchain
- Handle resolution (handle → address)
- Transaction preparation
- QR code generation/decoding
- Data aggregation and caching

**Endpoints:**
- `/api/handles/*` - Handle management
- `/api/payments/*` - Payment operations
- `/api/requests/*` - Payment requests
- `/api/transactions/*` - Transaction history
- `/api/qr/*` - QR code operations

### 3. Smart Contracts

**Location:** `/contracts`

**Contracts:**
1. **HandleRegistry.sol**
   - Manages @username → address mappings
   - Handles claiming and mapping
   - Fee collection (0.001 MON)

2. **Payment.sol**
   - MON token transfers
   - Transaction recording
   - Event emission

3. **PaymentRequest.sol**
   - Payment request creation
   - Request fulfillment
   - Expiry management

## Data Flow

### Handle Claiming Flow

```
User → Frontend → Middleware → HandleRegistry Contract
                              ↓
                         Transaction Signed
                              ↓
                         Handle Mapped
                              ↓
User ← Frontend ← Middleware ← Event Emitted
```

### Payment Flow

```
User enters handle + amount
    ↓
Frontend: POST /api/payments/send
    ↓
Middleware: Resolve handle → address
    ↓
Middleware: Prepare transaction data
    ↓
Frontend: Sign transaction with wallet
    ↓
Frontend: Send to Payment contract
    ↓
Contract: Transfer MON + Emit events
    ↓
Frontend: Show success screen
```

### Payment Request Flow

```
User creates request
    ↓
Frontend: POST /api/requests/create
    ↓
Middleware: Create request on contract
    ↓
Middleware: Generate QR code data
    ↓
Frontend: Display QR code
    ↓
Recipient scans QR
    ↓
Frontend: Decode QR → Pre-fill Send screen
    ↓
Recipient fulfills request
```

## Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI:** Radix UI components
- **Animations:** Motion (Framer Motion)
- **Wallet:** ethers.js / wagmi (for wallet connection)

### Middleware
- **Framework:** Express.js
- **Language:** TypeScript
- **Blockchain:** ethers.js v6
- **Validation:** Zod
- **QR Codes:** qrcode library

### Smart Contracts
- **Language:** Solidity 0.8.20
- **Chain:** Monad blockchain
- **Token:** Native MON (Ether equivalent)

## Security Considerations

### Frontend
- ✅ Client-side wallet connection (no key storage)
- ✅ Input validation
- ✅ Transaction confirmation screens
- ✅ Error handling

### Middleware
- ✅ Input validation (Zod schemas)
- ✅ CORS configuration
- ✅ Error handling
- ⚠️ Rate limiting (recommended)
- ⚠️ Authentication (for admin endpoints)

### Smart Contracts
- ✅ Input validation
- ✅ Access control (owner functions)
- ✅ Reentrancy protection
- ✅ Fee validation
- ⚠️ Consider adding pause mechanism
- ⚠️ Consider adding upgradeability

## Scalability

### Current Architecture
- Stateless middleware (can scale horizontally)
- Direct blockchain queries (may be slow)
- No caching layer

### Recommended Enhancements
1. **Transaction Indexer**
   - Index contract events
   - Store in database
   - Fast transaction queries

2. **Caching Layer**
   - Redis for handle lookups
   - Cache transaction data
   - Reduce RPC calls

3. **Load Balancing**
   - Multiple middleware instances
   - Load balancer in front
   - Health checks

4. **Database**
   - Store user profiles
   - Cache transaction history
   - Store payment requests

## Monitoring

### Recommended Metrics
- API response times
- Contract call success rates
- Transaction confirmation times
- Error rates by endpoint
- Handle claim frequency
- Payment volume

### Logging
- Middleware: Request/response logs
- Frontend: Error boundaries
- Contracts: Event emission

## Future Enhancements

1. **Multi-chain Support**
   - Support other EVM chains
   - Cross-chain payments

2. **Social Features**
   - Contact lists
   - Payment groups
   - Activity feed

3. **Advanced Features**
   - Recurring payments
   - Payment splitting
   - Escrow services

4. **Mobile Apps**
   - React Native version
   - Native wallet integration

## Development Workflow

1. **Local Development**
   - Run local Monad node (or use testnet)
   - Deploy contracts locally
   - Run middleware locally
   - Run Next.js dev server

2. **Testing**
   - Unit tests for contracts
   - Integration tests for middleware
   - E2E tests for frontend

3. **Deployment**
   - Deploy contracts to testnet/mainnet
   - Deploy middleware to server
   - Deploy frontend to Vercel/Netlify

## File Structure

```
MonadPay Payment App/
├── app/                    # Next.js App Router
├── src/                    # React components
├── contracts/              # Solidity contracts
│   ├── HandleRegistry.sol
│   ├── Payment.sol
│   └── PaymentRequest.sol
├── middleware/             # Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/      # Business logic
│   │   └── abis/          # Contract ABIs
│   └── package.json
└── README.md
```

## Integration Points

### Frontend ↔ Middleware
- REST API calls
- JSON request/response
- Error handling

### Middleware ↔ Blockchain
- JSON-RPC calls
- Contract method calls
- Event listening

### Frontend ↔ Blockchain
- Direct wallet connections
- Transaction signing
- Event subscriptions (optional)

## Conclusion

This architecture provides a scalable, secure foundation for MonadPay. The separation of concerns (frontend, middleware, contracts) allows for independent development and deployment.

