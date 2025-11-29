/**
 * Simple deployment script using ethers.js directly
 * Alternative to Hardhat deployment
 * 
 * Usage: node scripts/deploy-simple.js
 */

const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Contract ABIs (minimal for deployment)
const HANDLE_REGISTRY_ABI = [
  "constructor()",
  "function HANDLE_FEE() view returns (uint256)",
];

const PAYMENT_ABI = [
  "constructor(address _handleRegistry)",
  "function handleRegistry() view returns (address)",
];

const PAYMENT_REQUEST_ABI = [
  "constructor(address _handleRegistry)",
  "function handleRegistry() view returns (address)",
];

async function deployContract(contractName, bytecode, abi, signer, constructorArgs = []) {
  console.log(`📦 Deploying ${contractName}...`);
  
  const factory = new ethers.ContractFactory(abi, bytecode, signer);
  const contract = await factory.deploy(...constructorArgs);
  
  console.log(`   Transaction hash: ${contract.deploymentTransaction().hash}`);
  console.log(`   Waiting for confirmation...`);
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  console.log(`✅ ${contractName} deployed to: ${address}\n`);
  
  return { contract, address, txHash: contract.deploymentTransaction().hash };
}

async function main() {
  console.log("🚀 Starting MonadPay Smart Contract Deployment (Simple)...\n");

  // Setup provider and signer
  const rpcUrl = process.env.MONAD_RPC_URL || "http://localhost:8545";
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("❌ PRIVATE_KEY not found in .env file");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  console.log("📝 Deploying with account:", signer.address);
  
  const balance = await provider.getBalance(signer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "MON\n");

  if (balance === 0n) {
    throw new Error("❌ Insufficient balance. Please fund your deployer account.");
  }

  // Read contract bytecode
  // Note: You'll need to compile contracts first and read the bytecode
  // This is a template - you'll need to add the actual bytecode
  const contractsDir = path.join(__dirname, "..", "artifacts", "contracts");
  
  let handleRegistryBytecode, paymentBytecode, paymentRequestBytecode;
  
  try {
    // Try to read from Hardhat artifacts
    const handleRegistryArtifact = JSON.parse(
      fs.readFileSync(path.join(contractsDir, "HandleRegistry.sol", "HandleRegistry.json"))
    );
    handleRegistryBytecode = handleRegistryArtifact.bytecode;

    const paymentArtifact = JSON.parse(
      fs.readFileSync(path.join(contractsDir, "Payment.sol", "Payment.json"))
    );
    paymentBytecode = paymentArtifact.bytecode;

    const paymentRequestArtifact = JSON.parse(
      fs.readFileSync(path.join(contractsDir, "PaymentRequest.sol", "PaymentRequest.json"))
    );
    paymentRequestBytecode = paymentRequestArtifact.bytecode;
  } catch (error) {
    console.error("❌ Could not read contract bytecode. Please compile contracts first:");
    console.error("   Run: npx hardhat compile");
    process.exit(1);
  }

  const deploymentInfo = {
    network: "custom",
    deployer: signer.address,
    timestamp: new Date().toISOString(),
    contracts: {},
  };

  try {
    // Deploy HandleRegistry
    const handleRegistry = await deployContract(
      "HandleRegistry",
      handleRegistryBytecode,
      HANDLE_REGISTRY_ABI,
      signer
    );
    deploymentInfo.contracts.HandleRegistry = {
      address: handleRegistry.address,
      txHash: handleRegistry.txHash,
    };

    // Verify
    const handleRegistryContract = new ethers.Contract(
      handleRegistry.address,
      HANDLE_REGISTRY_ABI,
      signer
    );
    const handleFee = await handleRegistryContract.HANDLE_FEE();
    console.log("   Handle Fee:", ethers.formatEther(handleFee), "MON\n");

    // Deploy Payment
    const payment = await deployContract(
      "Payment",
      paymentBytecode,
      PAYMENT_ABI,
      signer,
      [handleRegistry.address]
    );
    deploymentInfo.contracts.Payment = {
      address: payment.address,
      txHash: payment.txHash,
    };

    // Deploy PaymentRequest
    const paymentRequest = await deployContract(
      "PaymentRequest",
      paymentRequestBytecode,
      PAYMENT_REQUEST_ABI,
      signer,
      [handleRegistry.address]
    );
    deploymentInfo.contracts.PaymentRequest = {
      address: paymentRequest.address,
      txHash: paymentRequest.txHash,
    };

    // Save deployment info
    const deploymentDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentDir)) {
      fs.mkdirSync(deploymentDir, { recursive: true });
    }

    const deploymentFile = path.join(
      deploymentDir,
      `deployment-${Date.now()}.json`
    );
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 Deployment info saved to:", deploymentFile);

    // Update middleware .env
    const envFile = path.join(__dirname, "..", "..", "middleware", ".env");
    const envContent = `# MonadPay Middleware Configuration
# Generated by deployment script on ${new Date().toISOString()}

MONAD_RPC_URL=${rpcUrl}
HANDLE_REGISTRY_ADDRESS=${handleRegistry.address}
PAYMENT_CONTRACT_ADDRESS=${payment.address}
PAYMENT_REQUEST_CONTRACT_ADDRESS=${paymentRequest.address}
PORT=3001
NODE_ENV=production
`;

    fs.writeFileSync(envFile, envContent);
    console.log("📝 Middleware .env file updated:", envFile);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("✅ DEPLOYMENT COMPLETE!");
    console.log("=".repeat(60));
    console.log("\n📋 Contract Addresses:");
    console.log("   HandleRegistry:    ", handleRegistry.address);
    console.log("   Payment:            ", payment.address);
    console.log("   PaymentRequest:     ", paymentRequest.address);
    console.log("\n");

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };

