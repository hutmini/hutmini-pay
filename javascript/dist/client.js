"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProClient = void 0;
const core_js_1 = require("./core.js");
class ProClient {
    apiKey;
    engine;
    baseUrl = "https://api.hutmini.com/api/v1";
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.engine = core_js_1.HutStealthEngine;
        console.log("✅ ProClient (JS/TS) 初始化成功");
    }
    /**
      * 执行隐私支付
      */
    async executeStealthPay(receiverId, amount, currency = "USDC") {
        console.log("🔒 隐私保护已开启 (NPM Mode)");
        // 1. 查找接收方公钥
        const pubKeyResp = await fetch(`${this.baseUrl}/agents/${receiverId}/pubkey`);
        if (!pubKeyResp.ok) {
            throw new Error(`Failed to discover agent ${receiverId}: ${await pubKeyResp.text()}`);
        }
        const { pub_key: receiverPubKey } = await pubKeyResp.json();
        // 2. 本地生成隐身地址
        const { stealthAddress, ephemeralPubKey } = this.engine.generateStealthAddress(receiverPubKey);
        console.log(`🚀 Initiating stealth payment of ${amount} ${currency} to ${receiverId}...`);
        console.log(`📡 正在向隐身地址 ${stealthAddress} 发起支付...`);
        // 3. 提交结算请求
        const payResp = await fetch(`${this.baseUrl}/pay/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                receiver_id: receiverId,
                amount,
                currency,
                stealth_address: stealthAddress,
                ephemeral_key: ephemeralPubKey
            })
        });
        if (!payResp.ok) {
            throw new Error(`Payment execution failed: ${await payResp.text()}`);
        }
        return await payResp.json();
    }
}
exports.ProClient = ProClient;
