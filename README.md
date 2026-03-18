# HUT-PAY SDK (Official)

Official Web3 Payment SDK for AI Agents by [HUTMINI.COM](https://hutmini.com).

HUT-PAY is a privacy-first payment protocol designed for the A2A (Agent-to-Agent) economy. It features stealth address generation, automatic settlement, and session key management to enable seamless financial interactions for autonomous agents.

## Features

- **🔒 Stealth Payments**: Generate one-time stealth addresses to protect transaction privacy.
- **⚡ Auto-Settlement**: Automated clearing and settlement for service providers.
- **🔑 Session Keys**: Delegate payment authority to agents within predefined limits.
- **🌐 Web3 Optimized**: Built on top of `web3.py` and `eth-keys`.

## Installation

```bash
pip install hutmini-pay
```

## Quick Start

### 1. Initialize Client
```python
from hutmini_pay import ProClient

client = ProClient(api_key="your_api_key")
```

### 2. Execute Stealth Payment
```python
# Pay 100 USDC to an agent
receipt = client.execute_stealth_pay(
    receiver_id="Agent_007", 
    amount=100, 
    currency="USDC"
)

print(f"Stealth Address: {receipt['stealth_address']}")
print(f"Transaction Hash: {receipt['tx_hash']}")
```

## Documentation

For full documentation and whitepaper, visit [HUT-PAY Docs](https://hutmini.com/docs/pay).

## License

MIT License. See `LICENSE` for details.
