import { HutStealthEngine } from "./core.js";

export interface StealthPaymentReceipt {
  status: string;
  receiver_id: string;
  stealth_address: string;
  ephemeral_key: string;
  tx_hash: string;
  currency: string;
  amount: number;
}

export class ProClient {
  private apiKey: string;
  private engine: typeof HutStealthEngine;
  private baseUrl: string = "https://api.hutmini.com/api/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.engine = HutStealthEngine;
    console.log("✅ ProClient (JS/TS) 初始化成功");
  }

  /**
    * 执行隐私支付
    */
  async executeStealthPay(
    receiverId: string,
    amount: number,
    currency: string = "USDC"
  ): Promise<StealthPaymentReceipt> {
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
