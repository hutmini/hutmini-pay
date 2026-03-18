export declare class HutStealthEngine {
    /**
      * 生成隐身地址 (JS/TS 版本)
      * @param receiverPubKey 接收方的公钥 (Hex 字符串，支持 0x04 前缀)
      * @returns { stealthAddress: string, ephemeralPubKey: string }
      */
    static generateStealthAddress(receiverPubKey: string): {
        stealthAddress: string;
        ephemeralPubKey: string;
    };
}
