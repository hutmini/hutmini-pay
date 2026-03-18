export interface StealthPaymentReceipt {
    status: string;
    receiver_id: string;
    stealth_address: string;
    ephemeral_key: string;
    tx_hash: string;
    currency: string;
    amount: number;
}
export declare class ProClient {
    private apiKey;
    private engine;
    private baseUrl;
    constructor(apiKey: string);
    /**
      * 执行隐私支付
      */
    executeStealthPay(receiverId: string, amount: number, currency?: string): Promise<StealthPaymentReceipt>;
}
