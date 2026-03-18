import { ethers } from "ethers";
import nacl from "tweetnacl";
import bs58 from "bs58";

export class HutStealthEngine {
  /**
   * 自动识别公钥所属链
   */
  static identifyChain(pubKey: string): "evm" | "solana" {
    if (pubKey.startsWith("0x") || pubKey.length >= 128) {
      return "evm";
    }
    try {
      bs58.decode(pubKey);
      return "solana";
    } catch {
      return "evm";
    }
  }

  /**
   * EVM (Base/Ethereum) 隐私地址生成 (Secp256k1)
   */
  static generateStealthAddressEVM(receiverPubKeyHex: string) {
    const ephemeralWallet = ethers.Wallet.createRandom();
    const ephemeralPubKey = ephemeralWallet.signingKey.publicKey;

    let cleanPubKey = receiverPubKeyHex.replace("0x", "");
    if (cleanPubKey.length === 128) {
      cleanPubKey = "04" + cleanPubKey;
    }

    const sharedSecret = ethers.computeHmac(
      "sha256",
      ephemeralWallet.privateKey,
      "0x" + cleanPubKey
    );

    const viewTag = ethers.keccak256(sharedSecret);
    const stealthHash = ethers.keccak256(
      ethers.concat(["0x" + cleanPubKey.slice(2), viewTag])
    );
    const stealthAddress = ethers.getAddress("0x" + stealthHash.slice(-40));

    return {
      stealthAddress,
      ephemeralPubKey,
    };
  }

  /**
   * Solana (SOL) 隐私地址生成 (Ed25519)
   */
  static generateStealthAddressSolana(receiverPubKeyB58: string) {
    // 1. 生成临时 Ed25519 密钥对
    const ephemeralKeypair = nacl.sign.keyPair();
    const ephemeralPubKey = bs58.encode(ephemeralKeypair.publicKey);

    // 2. 解码接收方公钥
    const receiverPubKey = bs58.decode(receiverPubKeyB58);

    // 3. 派生隐身种子 (Solana 风格 A2A 握手)
    const combined = new Uint8Array([...ephemeralKeypair.publicKey, ...receiverPubKey]);
    const sharedSecret = nacl.hash(combined).slice(0, 32);

    // 4. 派生隐私地址
    const stealthSeed = new Uint8Array([...receiverPubKey, ...sharedSecret.slice(0, 8)]);
    const stealthAddress = bs58.encode(nacl.hash(stealthSeed).slice(0, 32));

    return {
      stealthAddress,
      ephemeralPubKey,
    };
  }

  /**
   * 统一生成接口
   */
  static generateStealthAddress(receiverPubKey: string) {
    const chain = this.identifyChain(receiverPubKey);
    if (chain === "solana") {
      return this.generateStealthAddressSolana(receiverPubKey);
    } else {
      return this.generateStealthAddressEVM(receiverPubKey);
    }
  }
}
