# monadpay Smart Contracts

Smart contracts for the monadpay payment application on Monad blockchain.

## Contracts

### 1. HandleRegistry.sol

Manages monadpay handles (@username) and their mappings to wallet addresses.

**Key Functions:**
- `claimHandle(string handle)` - Claim a new handle (for new wallets)
- `mapHandle(string handle)` - Map handle to existing wallet
- `isHandleAvailable(string handle)` - Check handle availability
- `getAddressByHandle(string handle)` - Resolve handle to address
- `getHandleByAddress(address wallet)` - Get handle for address

**Fee:** 0.001 MON per handle claim/mapping

### 2. Payment.sol

Handles MON token transfers between users via handles or direct addresses.

**Key Functions:**
- `sendPayment(string handle, string note)` - Send payment to a handle
- `sendPaymentToAddress(address recipient, string note)` - Send payment to address
- `getTransaction(bytes32 txHash)` - Get transaction details
- `getUserTransactions(address user)` - Get user's transaction history

**Events:**
- `PaymentSent` - Emitted when payment is sent
- `PaymentReceived` - Emitted when payment is received

### 3. PaymentRequest.sol

Manages payment requests (for QR code generation).

**Key Functions:**
- `createRequest(uint256 amount, string note, uint256 expiry)` - Create payment request
- `fulfillRequest(bytes32 requestId)` - Fulfill a payment request
- `cancelRequest(bytes32 requestId)` - Cancel a request
- `getRequest(bytes32 requestId)` - Get request details
- `isRequestValid(bytes32 requestId)` - Check if request is valid

**Events:**
- `PaymentRequestCreated` - Emitted when request is created
- `PaymentRequestFulfilled` - Emitted when request is fulfilled
- `PaymentRequestCancelled` - Emitted when request is cancelled

## Deployment

See [README-DEPLOYMENT.md](./README-DEPLOYMENT.md) for complete deployment guide.

### Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure `.env`:
```bash
cp .env.example .env
# Edit .env with your PRIVATE_KEY and RPC_URL
```

3. Compile contracts:
```bash
npm run compile
```

4. Deploy:
```bash
# Testnet
npm run deploy:testnet

# Mainnet
npm run deploy:monad
```

The deployment script will:
- Deploy all contracts in correct order
- Save deployment info to `deployments/` folder
- Automatically update middleware `.env` with addresses

## Testing

Contracts should be tested with:
- Handle format validation
- Fee collection
- Payment transfers
- Request creation and fulfillment
- Edge cases (expired requests, invalid handles, etc.)

## Security Considerations

- ✅ Input validation (handle format, amounts)
- ✅ Access control (owner-only functions)
- ✅ Reentrancy protection (using simple transfers)
- ✅ Fee validation
- ⚠️ Consider adding rate limiting for handle claims
- ⚠️ Consider adding handle release mechanism for users

## License

MIT

