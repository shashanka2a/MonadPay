/**
 * Contract Verification Script
 * Verifies deployed contracts on block explorer
 * 
 * Usage: node scripts/verify.js <network> <contract-address> [constructor-args]
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log("Usage: node scripts/verify.js <network> <contract-address> [constructor-args]");
    console.log("\nExample:");
    console.log("  node scripts/verify.js monad 0x1234...");
    console.log("  node scripts/verify.js monad 0x5678... 0x1234...");
    process.exit(1);
  }

  const [network, contractAddress, ...constructorArgs] = args;

  console.log(`🔍 Verifying contract on ${network}...`);
  console.log(`   Address: ${contractAddress}`);
  if (constructorArgs.length > 0) {
    console.log(`   Constructor args: ${constructorArgs.join(", ")}`);
  }
  console.log();

  try {
    // Determine contract name from address
    // You may need to check deployment files
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    const deploymentFiles = fs.readdirSync(deploymentsDir)
      .filter(f => f.endsWith(".json"))
      .map(f => path.join(deploymentsDir, f));

    let contractName = null;
    for (const file of deploymentFiles) {
      const deployment = JSON.parse(fs.readFileSync(file));
      for (const [name, info] of Object.entries(deployment.contracts || {})) {
        if (info.address.toLowerCase() === contractAddress.toLowerCase()) {
          contractName = name;
          break;
        }
      }
      if (contractName) break;
    }

    if (!contractName) {
      console.log("⚠️  Could not determine contract name from deployment files.");
      console.log("   Please specify contract name manually.");
      process.exit(1);
    }

    console.log(`📝 Contract: ${contractName}`);

    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArgs,
      network: network,
    });

    console.log(`✅ Contract verified successfully!`);
    console.log(`   View on explorer: https://explorer.monad.xyz/address/${contractAddress}`);

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


