# ❄️ zkvault-basic

zkvault-basic 是一个基于 zkSNARK 的最小可用零知识证明项目，旨在帮助开发者深入了解 zk 应用的基本工作流程，包括电路编写、proof 生成与合约验证等关键环节。

通过该项目，你可以掌握如何构建一个完整的 zk 应用，从本地开发到部署测试，涵盖前后端集成和 CLI 操作。

---

## 🎯 项目目标

zkvault-basic 的设计初衷是作为学习与分享的工具，复现匿名存取款的典型场景：

- 使用 zkSNARK 实现匿名存款与任意钱包取款
- 结合 Circom 与 Solidity，构建完整的零知识工作流
- 强调极简实现，聚焦核心概念，方便学习理解

本项目简化自 Tornado Cash 的基本机制，是入门 zk 应用开发的理想参考。

---

## ✨ 功能概览

### 存款

- 用户创建一个随机密钥 `secret`
- 根据该密钥生成一个承诺 `commitment`
- 使用该 `commitment`，将固定数量的 ETH 存入合约，实现匿名存款

### 取款

- 提供存款时的密钥 `secret`
- 生成对应的零知识证明 `proof`
- 使用任意钱包执行合约取款，资金可转入任意地址

---

## 🧱 项目结构

```bash
.
├── circuits/          # Circom 电路代码及构建产物
├── contracts/         # Solidity 智能合约：Vault + Verifier
├── scripts/           # CLI 脚本：执行 deposit 与 withdraw 操作
├── test/              # 电路和合约的单元测试
├── types/             # Typescript 需要的 module 定义文件
├── utils/             # 通用 Typescript 代码
└── README.md          # 当前项目说明文档
```

---

## ⚙️ 环境准备

1. 安装 Node.js，推荐版本：**v22**
2. 安装 Circom 2  
   安装指南：[https://docs.circom.io/getting-started/installation/](https://docs.circom.io/getting-started/installation/)
   ```bash
   circom --version
   ```
3. 安装本地测试网工具 Anvil  
   安装链接：[https://github.com/foundry-rs/foundry](https://github.com/foundry-rs/foundry)

---

## 📦 安装依赖

```bash
npm install
```

---

## 🔧 编译电路

生成电路所需的 `r1cs` 和 `wasm` 文件：

```bash
npm run build
```

---

## 🔐 Setup 电路（trusted setup）

前置要求：下载 `powersOfTau28_hez_final_12.ptau` 文件，并放置于项目根目录。

- 下载地址：[https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_12.ptau](https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_12.ptau)
- 如链接失效，请参考 [iden3/snarkjs](https://github.com/iden3/snarkjs?tab=readme-ov-file#7-prepare-phase-2)

执行 setup，生成 proving key、verifying key 及 Solidity verifier：

```bash
npm run setup
```

---

## 📄 编译智能合约

将 Vault 与 Verifier 合约编译为 EVM 可部署格式：

```bash
npm run compile
```

---

## 🧪 运行测试

包含 Circom 电路测试 + Solidity 合约测试：

```bash
npm run test
```

---

## 🚀 启动本地测试链（anvil）

默认地址为 `http://127.0.0.1:8545`：

```bash
npm run srv
```

---

## 🧾 环境变量配置（.env）

在项目根目录创建 `.env` 文件，例如：

```env
NETWORK = "test"
NODE_URL = "http://127.0.0.1:8545"
MNEMONIC = "<你的测试助记词>"
```

⚠️ 助记词仅用于本地测试，**切勿用于生产钱包**！

---

## 📤 合约部署至本地测试网

查看部署参数说明：

```bash
npm run deploy -- --help
```

例如，部署支持 1 ETH 存款金额的合约：

```bash
npm run deploy -- --denomination 1
```

---

## 🧭 CLI 命令使用

### 发起存款（deposit）

```bash
npm run cli -- deposit
```

执行成功后，将输出存款密钥 `secret`，请妥善保存。

### 发起取款（withdraw）

使用之前打印的密钥进行取款：

```bash
npm run cli -- withdraw --secret <your-secret>
```

---

## 📚 延伸阅读与参考

- [Circom 2 官方文档](https://docs.circom.io/)
- [Snarkjs 教程](https://github.com/iden3/snarkjs)
- [Zero Knowledge Proofs](https://ethereum.org/en/zero-knowledge-proofs/)

---

## 🚧 下一阶段计划

基于 merkle tree 实现升级版 zkvault-classic，完整断开借款和取款的地址关联。

---

## 📄 License

本项目使用 MIT 开源协议，详情见 [LICENSE](./LICENSE)。

---

## 🤝 联系与交流

欢迎交流、提问或探讨项目相关的任何内容。如果你在使用中遇到问题，或者想一起完善它，欢迎联系我：

- Email: zekele.win.0@gmail.com
- GitHub: [Zekele Win](https://github.com/zekele-win)
- X : [Zekele Win](https://x.com/zekele_win)

如果你觉得这个项目对你有帮助，欢迎 star ⭐️、fork 或分享给更多感兴趣的朋友 🙌
