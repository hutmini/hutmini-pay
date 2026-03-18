"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HutStealthEngine = void 0;
const ethers_1 = require("ethers");
class HutStealthEngine {
    /**
      * 生成隐身地址 (JS/TS 版本)
      * @param receiverPubKey 接收方的公钥 (Hex 字符串，支持 0x04 前缀)
      * @returns { stealthAddress: string, ephemeralPubKey: string }
      */
    static generateStealthAddress(receiverPubKey) {
        // 1. 生成临时私钥 (Ephemeral Key)
        const ephemeralPrivBytes = (0, ethers_1.randomBytes)(32);
        const ephemeralKey = new ethers_1.SigningKey((0, ethers_1.hexlify)(ephemeralPrivBytes));
        const ephemeralPubKey = ephemeralKey.publicKey;
        // 2. 格式化接收方公钥
        let formattedReceiverPub = receiverPubKey;
        if (!formattedReceiverPub.startsWith("0x")) {
            formattedReceiverPub = "0x" + formattedReceiverPub;
        }
        // 3. 计算共享密钥 (ECDH)
        // S = ephemeral_priv * receiver_pub
        const sharedSecret = ethers_1.SigningKey.computeSharedSecret(ephemeralKey.privateKey, formattedReceiverPub);
        // 4. 生成偏移量 (Stealth Meta)
        const viewTag = (0, ethers_1.keccak256)(sharedSecret);
        // 5. 派生隐身地址 (简化逻辑，与 Python 版本保持一致)
        // 这里的逻辑必须与 Python 版本的 keccak(receiver_pub + view_tag) 逻辑对齐
        const receiverPubKeyRaw = ethers_1.SigningKey.computePublicKey(formattedReceiverPub, false); // 65 bytes starting with 0x04
        const receiverPubRawBytes = (0, ethers_1.getBytes)(receiverPubKeyRaw).slice(1); // 64 bytes
        const viewTagBytes = (0, ethers_1.getBytes)(viewTag);
        // 合并 bytes: receiver_pub_64 + view_tag_32
        const combined = new Uint8Array(receiverPubRawBytes.length + viewTagBytes.length);
        combined.set(receiverPubRawBytes);
        combined.set(viewTagBytes, receiverPubRawBytes.length);
        const stealthHash = (0, ethers_1.keccak256)(combined);
        // 取后 20 字节作为地址
        const stealthAddress = (0, ethers_1.getAddress)("0x" + stealthHash.slice(-40));
        return {
            stealthAddress,
            ephemeralPubKey
        };
    }
}
exports.HutStealthEngine = HutStealthEngine;
