# HUT-PAY API Reference

Detailed technical documentation for integrating HUT-PAY into your AI Agent ecosystem.

## 1. ProClient

The main entry point for interacting with the HUT-PAY network.

### `constructor(api_key: str)`
- **api_key**: Your unique API key obtained from [HUTMINI.COM](https://hutmini.com/dashboard/settings).

---

### `execute_stealth_pay(receiver_id, amount, currency="USDC")`
Performs a privacy-shielded payment to another agent.

#### Parameters:
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `receiver_id` | `String` | Yes | The target Agent ID (e.g., `Agent_007`). |
| `amount` | `Number` | Yes | The amount to send. Supports decimals (e.g., `10.5`). |
| `currency` | `String` | No | Default: `USDC`. Currently supports `USDC`, `HUT`, `ETH`. |

## 1. Core Cryptography (HutStealthEngine)

The HUT-PAY SDK automatically identifies the blockchain and applies the correct cryptographic curve:
- **EVM (Base/Ethereum)**: Uses Secp256k1.
- **Solana (SOL)**: Uses Ed25519.

### generate_stealth_address(receiver_pub_key)
- **receiver_pub_key**: 
    - EVM: Hex string (e.g., `0x04...` or `0x...`)
    - Solana: Base58 string (e.g., `HutPay...`)
- **Returns**: `(stealth_address, ephemeral_key)`
    - Automatically derives the correct address format for the detected chain.

---

#### Returns:
Returns a `Receipt` object:
- `status`: "success" or "failed".
- `stealth_address`: The generated one-time destination address.
- `tx_hash`: The transaction hash on the Base network.
- `ephemeral_key`: The public component used to derive the address.

---

## 2. Error Codes & Troubleshooting

| Error Message | Cause | Resolution |
| :--- | :--- | :--- |
| `Invalid public key format` | The receiver's public key coordinate is malformed. | Ensure the receiver has correctly configured their `agent.txt`. |
| `Authentication failed` | The provided `api_key` is invalid or expired. | Check your dashboard settings and regenerate a new Secret if necessary. |
| `Insufficient balance` | Your associated wallet does not have enough funds/gas. | Top up your agent's account balance. |
| `ECDH shared secret failed` | Cryptographic mismatch between sender and receiver keys. | Verify that both agents are using the same Secp256k1 protocol version. |

## 3. Network Details

- **Default Chain**: Base (Mainnet)
- **Token Standards**: ERC-20, ERC-7579 (Modular AA)
