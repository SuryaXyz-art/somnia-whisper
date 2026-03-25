import pkg from "hardhat";
const { ethers } = pkg as any;
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { SDK } from "@somnia-chain/reactivity";
import { parseGwei } from "viem";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define strict testnet chain for viem
const somniaTestnet = {
  id: 50312,
  name: 'Somnia Shannon Testnet',
  nativeCurrency: { name: 'STT', symbol: 'STT', decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_SOMNIA_RPC || 'https://dream-rpc.somnia.network'] } },
  blockExplorers: { default: { name: 'Explorer', url: 'https://shannon-explorer.somnia.network' } },
} as const;

async function main() {
  console.log("Starting deployment to Somnia Testnet...\n");

  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Current balance:", ethers.formatEther(balance), "STT\n");

  if (balance === BigInt(0)) {
    throw new Error("Deployer account has no funds. Please get some STT from the faucet.");
  }

  // 1. Deploy SomniaWhisperFortune
  const FortuneFactory = await ethers.getContractFactory("SomniaWhisperFortune");
  const fortune = await FortuneFactory.deploy();
  await fortune.waitForDeployment();
  const fortuneAddress = await fortune.getAddress();
  const fortuneTx = fortune.deploymentTransaction();
  const fortuneReceipt = await fortuneTx?.wait();

  console.log(`\nSomniaWhisperFortune deployed to: ${fortuneAddress}`);

  // 2. Deploy FortuneReactiveHandler
  const HandlerFactory = await ethers.getContractFactory("FortuneReactiveHandler");
  const handler = await HandlerFactory.deploy(fortuneAddress);
  await handler.waitForDeployment();
  const handlerAddress = await handler.getAddress();
  const handlerTx = handler.deploymentTransaction();
  const handlerReceipt = await handlerTx?.wait();

  console.log(`FortuneReactiveHandler deployed to: ${handlerAddress}`);

  // 3. Setup Reactivity Subscription
  console.log("\nSetting up Somnia reactivity subscription...");
  
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("PRIVATE_KEY not found in .env.local");
  
  const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey as `0x${string}` : `0x${privateKey}`);
  
  const publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http()
  });
  
  const walletClient = createWalletClient({
    account,
    chain: somniaTestnet,
    transport: http()
  });

  const sdk = new SDK({ public: publicClient, wallet: walletClient });

  console.log("Creating Solidity subscription on handler...");
  const subTxHash = await sdk.createSoliditySubscription({
    handlerContractAddress: handlerAddress,
    priorityFeePerGas: parseGwei('2'),
    maxFeePerGas: parseGwei('10'),
    gasLimit: BigInt(2_000_000),
    isGuaranteed: true,
    isCoalesced: false,
  });

  console.log("Subscription created! Tx:", subTxHash);

  // 4. Update .env.local
  const envPath = path.resolve(__dirname, "../.env.local");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";

  if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/g,
      `NEXT_PUBLIC_CONTRACT_ADDRESS=${fortuneAddress}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${fortuneAddress}\n`;
  }

  if (envContent.includes("NEXT_PUBLIC_REACTIVE_HANDLER=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_REACTIVE_HANDLER=.*/g,
      `NEXT_PUBLIC_REACTIVE_HANDLER=${handlerAddress}`
    );
  } else {
    envContent += `NEXT_PUBLIC_REACTIVE_HANDLER=${handlerAddress}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("\nUpdated .env.local with new contract addresses.");

  // 5. Summary Table
  console.table([
    {
      Contract: "SomniaWhisperFortune",
      Address: fortuneAddress,
      Block: fortuneReceipt?.blockNumber,
      TxHash: fortuneTx?.hash,
    },
    {
      Contract: "FortuneReactiveHandler",
      Address: handlerAddress,
      Block: handlerReceipt?.blockNumber,
      TxHash: handlerTx?.hash,
    }
  ]);

  // 6. Explorer URLs
  console.log("\nVerifier Links:");
  console.log(`SomniaWhisperFortune: https://shannon-explorer.somnia.network/address/${fortuneAddress}`);
  console.log(`FortuneReactiveHandler: https://shannon-explorer.somnia.network/address/${handlerAddress}`);
}

main().catch((error) => {
  console.error("Error during deployment:");
  console.error(error);
  process.exitCode = 1;
});
