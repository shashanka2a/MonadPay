# Smart Contract Deployment Guide

Complete guide for deploying monadpay smart contracts to Monad blockchain.

## Prerequisites

1. **Node.js 18+** installed
2. **MON tokens** in your deployer wallet for gas fees
3. **Private key** of the deployer account (keep this secure!)
4. **RPC URL** for Monad network (mainnet or testnet)

## Setup

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add:
- `PRIVATE_KEY` - Your deployer wallet private key (0x...)
- `MONAD_RPC_URL` - Monad network RPC endpoint
- `CHAIN_ID` - Monad chain ID (default: 10143)

**⚠️ Security Warning:** Never commit `.env` file to git!

## Deployment Methods

### Method 1: Using Hardhat (Recommended)

#### Step 1: Compile Contracts

```bash
npm run compile
```

#### Step 2: Deploy to Network

**Local Network:**
```bash
npm run deploy:local
```

**Monad Testnet:**
```bash
npm run deploy:testnet
```

**Monad Mainnet:**
```bash
npm run deploy:monad
```

**Custom Network:**
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

### Method 2: Using Simple Script

```bash
# First compile with Hardhat
npm run compile

# Then run simple deployment
node scripts/deploy-simple.js
```

## Deployment Process

The script will:

1. ✅ **Deploy HandleRegistry** - First contract (no dependencies)
2. ✅ **Deploy Payment** - Requires HandleRegistry address
3. ✅ **Deploy PaymentRequest** - Requires HandleRegistry address
4. ✅ **Save deployment info** - Creates JSON file in `deployments/` folder
5. ✅ **Update middleware .env** - Automatically updates contract addresses

## Deployment Output

After successful deployment, you'll see:

```
✅ DEPLOYMENT COMPLETE!
============================================================

📋 Contract Addresses:
   HandleRegistry:    0x1234...
   Payment:            0x5678...
   PaymentRequest:     0x9abc...

📝 Next Steps:
   1. Verify contracts on block explorer (if available)
   2. Update middleware .env with contract addresses
   3. Start middleware: cd middleware && npm run dev
   4. Test contract interactions
```

## Verification

### Verify on Block Explorer

If your network has a block explorer:

```bash
npx hardhat verify --network monad <CONTRACT_ADDRESS> [CONSTRUCTOR_ARGS]
```

Example:
```bash
# HandleRegistry (no constructor args)
npx hardhat verify --network monad 0x1234...

# Payment (requires HandleRegistry address)
npx hardhat verify --network monad 0x5678... 0x1234...

# PaymentRequest (requires HandleRegistry address)
npx hardhat verify --network monad 0x9abc... 0x1234...
```

## Deployment Files

### Deployment JSON

Each deployment creates a JSON file in `deployments/`:
```json
{
  "network": "monad",
  "deployer": "0x...",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "contracts": {
    "HandleRegistry": {
      "address": "0x...",
      "txHash": "0x..."
    },
    "Payment": {
      "address": "0x...",
      "txHash": "0x..."
    },
    "PaymentRequest": {
      "address": "0x...",
      "txHash": "0x..."
    }
  }
}
```

### Middleware .env

The script automatically updates `../middleware/.env`:
```env
MONAD_RPC_URL=https://...
HANDLE_REGISTRY_ADDRESS=0x...
PAYMENT_CONTRACT_ADDRESS=0x...
PAYMENT_REQUEST_CONTRACT_ADDRESS=0x...
PORT=3001
NODE_ENV=production
```

## Troubleshooting

### Insufficient Balance

**Error:** `Insufficient balance`

**Solution:** Fund your deployer wallet with MON tokens

### Compilation Errors

**Error:** `Cannot find module` or compilation fails

**Solution:** 
```bash
npm install
npm run compile
```

### Network Connection Issues

**Error:** `Network error` or `ECONNREFUSED`

**Solution:** 
- Check RPC URL is correct
- Verify network is accessible
- Check firewall settings

### Contract Deployment Fails

**Error:** Transaction reverts

**Solution:**
- Check gas limit is sufficient
- Verify constructor arguments
- Check contract bytecode is valid

## Security Best Practices

1. ✅ **Never commit private keys** to git
2. ✅ **Use environment variables** for sensitive data
3. ✅ **Test on testnet first** before mainnet
4. ✅ **Verify contracts** on block explorer
5. ✅ **Keep deployment records** for audit trail
6. ✅ **Use hardware wallets** for mainnet deployments

## Gas Estimation

Approximate gas costs (may vary):

- HandleRegistry: ~2,000,000 gas
- Payment: ~1,500,000 gas
- PaymentRequest: ~1,500,000 gas

**Total:** ~5,000,000 gas

## Next Steps After Deployment

1. ✅ Verify contracts on block explorer
2. ✅ Update middleware `.env` (auto-updated by script)
3. ✅ Test contract interactions
4. ✅ Update frontend with contract addresses
5. ✅ Document deployment for team

## Support

For issues:
1. Check Hardhat documentation
2. Review contract compilation errors
3. Verify network configuration
4. Check gas prices and limits



