👉 [简体中文](./README.zh-CN.md)

<h1 align="center">zkvault-basic</h1>
<p align="center">
  <img src="https://komarev.com/ghpvc/?username=zekele-win&color=blueviolet&style=flat-square" alt="Visitor Count" />
</p>

**zkvault-basic** is a minimal, functional zero-knowledge proof project based on zkSNARKs, designed to help developers understand the fundamental workflow of zk applications—including circuit writing, proof generation, and smart contract verification.

This project guides you through building a complete zk application, from local development to deployment and testing, covering frontend/backend integration and CLI operations.

---

## 🎯 Project Goals

zkvault-basic is designed as a learning and sharing tool to replicate a typical anonymous deposit/withdrawal scenario:

- Use zkSNARK to enable anonymous deposits and withdrawals to arbitrary wallets
- Combine Circom and Solidity to construct a full zero-knowledge workflow
- Emphasize minimal implementation, focusing on core concepts for easier understanding

This project is a simplified version of Tornado Cash’s basic mechanism—an ideal reference for getting started with zk app development.

---

## ✨ Feature Overview

### Deposit

- The user generates a random secret
- A commitment is derived from this secret
- ETH of a fixed denomination is deposited into the contract using this commitment, enabling anonymous deposit

### Withdrawal

- Provide the original deposit secret
- Generate the corresponding zero-knowledge proof
- Use any wallet to execute the withdrawal and transfer funds to any desired address

---

## 🧱 Project Structure

```bash
.
├── circuits/                          # Circom ZK circuits
│   └── ZkVaultBasic.circom            # Main circuit implementing deposit/withdraw logic
│
├── contracts/                         # Solidity smart contracts
│   ├── ZkVaultBasic.sol               # ZK-enabled Vault contract
│   └── ZkVaultBasicVerifier.sol       # Auto-generated Groth16 verifier contract
│
├── scripts/                           # CLI and deployment scripts
│   ├── cli.ts                         # Command-line interface for deposit/withdraw testing
│   └── deploy.ts                      # Deploys contracts to local or testnet environments
│
├── test/                              # Tests for circuits and contracts
│   ├── utils.hex.test.ts              # Unit tests for hex encoding utilities
│   ├── utils.pedersen.test.ts         # Unit tests for Pedersen hash implementation
│   ├── ZkVaultBasic.circom.test.ts    # Tests for circuit correctness and witness verification
│   └── ZkVaultBasic.sol.test.ts       # Tests for smart contract behavior and proof validation
│
├── types/                             # Type declarations for external JS/TS libraries
│   ├── circom_tester.d.ts             # Types for circom_tester (circuit tester wrapper)
│   └── ffjavascript.d.ts              # Types for ffjavascript (bigint/buffer utils)
│
├── utils/                             # Utility modules used across scripts and tests
│   ├── hex.ts                         # Hex encoding/decoding helpers
│   └── pedersen.ts                    # Pedersen hash implementation (compatible with circom)
│
├── .mocharc.json                      # Mocha testing framework configuration
├── hardhat.config.ts                  # Hardhat config for smart contract compilation/deployment
├── package.json                       # Project dependencies and scripts
└── tsconfig.json                      # TypeScript configuration
```

---

## ⚙️ Prerequisites

1. Install Node.js (recommended version: **v22**)
2. Install Circom 2  
   Installation guide: [https://docs.circom.io/getting-started/installation/](https://docs.circom.io/getting-started/installation/)
   ```bash
   circom --version
   ```
3. Install Anvil (local testnet tool)  
   Installation: [https://github.com/foundry-rs/foundry](https://github.com/foundry-rs/foundry)

---

## 📦 Install Dependencies

```bash
npm install
```

---

## 🔧 Build Circuits

Generate `r1cs` and `wasm` files:

```bash
npm run build
```

---

## 🔐 Setup Circuits (Trusted Setup)

Precondition: Download `powersOfTau28_hez_final_12.ptau` and place it in the project root.

- Download: [https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_12.ptau](https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_12.ptau)
- If the link is broken, refer to [iden3/snarkjs](https://github.com/iden3/snarkjs?tab=readme-ov-file#7-prepare-phase-2)

Run setup to generate proving key, verifying key, and Solidity verifier:

```bash
npm run setup
```

---

## 📄 Compile Smart Contracts

Compile Vault and Verifier contracts to EVM-compatible bytecode:

```bash
npm run compile
```

---

## 🧪 Run Tests

Includes Circom circuit tests and Solidity contract tests:

```bash
npm run test
```

---

## 🚀 Start Local Testnet (Anvil)

Default endpoint: `http://127.0.0.1:8545`:

```bash
npm run srv
```

---

## 🧾 Environment Variables (.env)

Create a `.env` file in the root directory, e.g.:

```env
NETWORK = "test"
NODE_URL = "http://127.0.0.1:8545"
MNEMONIC = "<your test mnemonic>"
```

⚠️ The mnemonic is for local testing only. **Do NOT use real wallet credentials!**

---

## 📤 Deploy Contracts to Local Testnet

View help:

```bash
npm run deploy -- --help
```

For example, to deploy a vault with 1 ETH denomination:

```bash
npm run deploy -- --denomination 1
```

---

## 🧭 CLI Commands

### Make a Deposit

```bash
npm run cli -- deposit
```

The command will print a `secret` — store it securely.

### Make a Withdrawal

Withdraw using the previously printed secret:

```bash
npm run cli -- withdraw --secret <your-secret>
```

---

## 📚 Further Reading & References

- [Circom 2 Documentation](https://docs.circom.io/)
- [Snarkjs Tutorial](https://github.com/iden3/snarkjs)
- [Zero Knowledge Proofs on Ethereum.org](https://ethereum.org/en/zero-knowledge-proofs/)

---

## 🚧 Next Steps

Upgrade to `zkvault-classic` by implementing a Merkle Tree to fully decouple deposit and withdrawal addresses.

---

## 📄 License

This project uses the MIT license. See [LICENSE](./LICENSE) for details.

---

## 🤝 Contact

Feel free to reach out for questions, collaboration, or improvements:

- Email: zekele.win.0@gmail.com
- GitHub: [Zekele Win](https://github.com/zekele-win)
- X : [Zekele Win](https://x.com/zekele_win)

If you find this project helpful, consider giving it a star ⭐️, fork, or sharing it with others 🙌
