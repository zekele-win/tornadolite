import { program } from "commander";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import fs from "fs";
import { BytesLike, ethers } from "ethers";
import crypto from "crypto";
import { utils as ffutils } from "ffjavascript";
import * as snarkjs from "snarkjs";
import { to as toHex } from "../utils/hex";
import { hash as pedersenHash } from "../utils/pedersen";

function generateWallet(
  mnemonic: string,
  index: number,
  provider: ethers.JsonRpcProvider
): ethers.Wallet {
  const hdAallet = ethers.HDNodeWallet.fromPhrase(
    mnemonic,
    undefined,
    `m/44'/60'/0'/0/${index}`
  );
  return new ethers.Wallet(hdAallet.privateKey, provider);
}

function getVaultContractAddress(network: string): string {
  const filePath = path.join(
    __dirname,
    `../artifacts/deployments/${network}/ZkVaultBasic.json`
  );

  const deployment = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return deployment.address;
}

function getVaultContractAbi(): any[] {
  const filePath = path.join(__dirname, `../artifacts/abis/ZkVaultBasic.json`);

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function deposit() {
  const network = process.env.NETWORK as string;
  const nodeUrl = process.env.NODE_URL as string;
  const mnemonic = process.env.MNEMONIC as string;

  const provider = new ethers.JsonRpcProvider(nodeUrl);

  const depositWallet = generateWallet(mnemonic, 0, provider);
  console.log({ depositWallet });

  const vaultContract = new ethers.Contract(
    getVaultContractAddress(network),
    getVaultContractAbi(),
    depositWallet
  );

  // Check balance of wallet and contract before.
  console.log({
    depositWalletBlanceBefore: await provider.getBalance(depositWallet.address),
    vaultContractBlanceBefore: await provider.getBalance(
      await vaultContract.getAddress()
    ),
  });

  // Generate secret.
  const secret = ffutils.leBuff2int(crypto.randomBytes(31));
  console.log({ secret });

  // Calculate commitment.
  const commitment = await pedersenHash(secret);
  console.log({ commitment });

  // Get denomination.
  const denomination = await vaultContract.denomination();
  console.log({ denomination: ethers.formatEther(denomination) });

  // Do deposit.
  const tx = await vaultContract.deposit(toHex(commitment), {
    value: denomination,
    gasLimit: 5_000_000,
    maxFeePerGas: ethers.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
  });
  console.log({ tx });
  const receipt = await tx.wait();
  console.log({ receipt });

  // Check balance of wallet and contract after.
  console.log({
    depositWalletBlanceAfter: await provider.getBalance(depositWallet.address),
    vaultContractBlanceAfter: await provider.getBalance(
      await vaultContract.getAddress()
    ),
  });

  process.exit(0);
}

async function withdraw(secret: bigint) {
  console.log({ secret });

  const network = process.env.NETWORK as string;
  const nodeUrl = process.env.NODE_URL as string;
  const mnemonic = process.env.MNEMONIC as string;

  const provider = new ethers.JsonRpcProvider(nodeUrl);

  const withdrawWallet = generateWallet(mnemonic, 1, provider);
  const recipientWallet = generateWallet(mnemonic, 2, provider);
  console.log({ withdrawWallet, recipientWallet });

  const vaultContract = new ethers.Contract(
    getVaultContractAddress(network),
    getVaultContractAbi(),
    withdrawWallet
  );

  // Check balance of wallet and contract before.
  console.log({
    depositWalletBlanceBefore: await provider.getBalance(
      withdrawWallet.address
    ),
    recipientWalletBlanceBefore: await provider.getBalance(
      recipientWallet.address
    ),
    vaultContractBlanceBefore: await provider.getBalance(
      await vaultContract.getAddress()
    ),
  });

  // Calculate commitment.
  const commitment = await pedersenHash(secret);
  console.log({ commitment });

  // Calculate proof.
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    {
      // Public inputs
      commitment,
      recipient: BigInt(recipientWallet.address),

      // Private inputs
      secret,
    },
    path.join(__dirname, "../circuits/build/ZkVaultBasic_js/ZkVaultBasic.wasm"),
    path.join(__dirname, "../circuits/build/ZkVaultBasic.zkey")
  );

  // Do withdraw.
  const tx = await vaultContract.withdraw(
    [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])],
    [
      [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
      [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
    ],
    [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])],
    [
      BigInt(publicSignals[0]),
      BigInt(publicSignals[1]),
      BigInt(publicSignals[2]),
      BigInt(publicSignals[3]),
    ]
  );
  console.log({ tx });
  const receipt = await tx.wait();
  console.log({ receipt });

  // Check balance of wallet and contract after.
  console.log({
    depositWalletBlanceAfter: await provider.getBalance(withdrawWallet.address),
    recipientWalletBlanceAfter: await provider.getBalance(
      recipientWallet.address
    ),
    vaultContractBlanceAfter: await provider.getBalance(
      await vaultContract.getAddress()
    ),
  });

  process.exit(0);
}

async function main() {
  program.description("zkvault-basic CLI");

  program
    .command("deposit")
    .description("Deposit ETH into the vault.")
    .action(async () => {
      await deposit();
    });

  program
    .command("withdraw")
    .description("Withdraw ETH from the vault.")
    .option(
      "--secret <secret>",
      "The returned secret when you deposit.",
      (value) => BigInt(value)
    )
    .action(async (opts) => {
      await withdraw(opts.secret);
    });

  program.parse();
}

main();
