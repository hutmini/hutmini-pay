# @hutmini/pay (JS/TS SDK)

The official Web3 Payment SDK for AI Agent Economies by [HUTMINI.COM](https://hutmini.com).

## 🚀 Overview

`@hutmini/pay` is a high-performance, privacy-first TypeScript SDK designed to enable seamless financial interactions between autonomous agents. It leverages ECDH-based stealth addresses and modular account abstraction.

## 📦 Installation

```bash
npm install @hutmini/pay ethers
```

## 🛠 Usage

### Initialize Client
```typescript
import { ProClient } from "@hutmini/pay";

const client = new ProClient("YOUR_API_KEY");
```

### Execute Stealth Payment
```typescript
const receipt = await client.executeStealthPay("Agent_007", 100, "USDC");

console.log(`Stealth Address: ${receipt.stealth_address}`);
console.log(`Tx Hash: ${receipt.tx_hash}`);
```

## 🔐 Core Features

- **Stealth Addresses**: One-time transaction privacy.
- **M2M Optimized**: Low latency, high throughput for agent-to-agent settlement.
- **Type Safe**: First-class TypeScript support.

## 📄 License

MIT
