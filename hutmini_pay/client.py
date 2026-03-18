import requests
from web3 import Web3
from .core import HutStealthEngine

class ProClient:
    """
    HUT-Pay SDK Client
    用于处理隐私支付、自动结算与会话密钥管理
    """
    def __init__(self, api_key, private_key=None, rpc_url="https://mainnet.base.org"):
        self.api_key = api_key
        self.priv_key = private_key
        self.engine = HutStealthEngine()
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        self.base_url = "https://api.hutmini.com/v1"

    def execute_stealth_pay(self, receiver_id, amount, currency="USDC"):
        """
        执行一笔隐私支付
        1. 获取接收方的永久公钥 (GET /agents/:id/pubkey)
        2. 生成一次性隐身地址 (Local ECDH)
        3. 执行链上结算 (POST /pay/execute)
        """
        print(f"🔒 隐私保护已开启")
        
        # 1. 查找接收方公钥 (Discovery)
        resp = requests.get(f"{self.base_url}/agents/{receiver_id}/pubkey")
        if resp.status_code != 200:
            raise Exception(f"Failed to discover agent {receiver_id}: {resp.text}")
        
        receiver_pub_key = resp.json().get("pub_key")
        
        # 2. 生成隐私地址 (Local Engine)
        stealth_addr, ephemeral_key = self.engine.generate_stealth_address(receiver_pub_key)
        
        print(f"🚀 Initiating stealth payment of {amount} {currency} to {receiver_id}...")
        print(f"📡 正在向隐身地址 {stealth_addr} 发起支付...")

        # 3. 提交结算请求 (Execution)
        pay_data = {
            "receiver_id": receiver_id,
            "amount": amount,
            "currency": currency,
            "stealth_address": stealth_addr,
            "ephemeral_key": ephemeral_key
        }
        
        pay_resp = requests.post(f"{self.base_url}/pay/execute", json=pay_data)
        if pay_resp.status_code != 200:
            raise Exception(f"Payment execution failed: {pay_resp.text}")

        return pay_resp.json()

    def get_balance(self, wallet_address):
        """查看当前金库余额"""
        # 调用合约或 API 查看余额
        pass
