import os
import base58
from coincurve import PrivateKey as SecpPrivateKey, PublicKey as SecpPublicKey
from eth_utils import keccak, to_checksum_address
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import hashes

class HutStealthEngine:
    """
    HUT-Pay Multi-Chain Privacy Engine
    Supports: Base/Ethereum (Secp256k1) and Solana (Ed25519)
    """

    @staticmethod
    def identify_chain(pub_key):
        """自动识别公钥所属链"""
        if isinstance(pub_key, str):
            if pub_key.startswith('0x') or len(pub_key) in [128, 130]:
                return "evm"
            # Solana addresses are base58 encoded and usually 32-44 chars
            try:
                base58.b58decode(pub_key)
                return "solana"
            except:
                pass
        return "evm" # Default to EVM

    @staticmethod
    def generate_stealth_address_evm(receiver_pub_key_hex):
        """EVM (Base/Ethereum) 隐私地址生成 (Secp256k1)"""
        ephemeral_priv = SecpPrivateKey(os.urandom(32))
        ephemeral_pub_hex = ephemeral_priv.public_key.format().hex()

        pub_hex = receiver_pub_key_hex.replace('0x', '')
        if len(pub_hex) == 128:
            pub_hex = '04' + pub_hex
        
        receiver_pub = SecpPublicKey(bytes.fromhex(pub_hex))
        shared_secret = ephemeral_priv.ecdh(receiver_pub.format())
        
        view_tag = keccak(shared_secret)
        stealth_pub_seed = receiver_pub.format(compressed=False)[1:] + view_tag
        stealth_hash = keccak(stealth_pub_seed)
        stealth_address = to_checksum_address(stealth_hash[-20:])
        
        return stealth_address, ephemeral_pub_hex

    @staticmethod
    def generate_stealth_address_solana(receiver_pub_key_b58):
        """Solana (SOL) 隐私地址生成 (Ed25519)"""
        # 1. 生成临时 Ed25519 私钥
        ephemeral_priv = ed25519.Ed25519PrivateKey.generate()
        ephemeral_pub_bytes = ephemeral_priv.public_key().public_bytes_raw()
        
        # 2. 解码接收方公钥
        receiver_pub_bytes = base58.b58decode(receiver_pub_key_b58)
        
        # 3. 计算共享秘密
        digest = hashes.Hash(hashes.SHA256())
        digest.update(ephemeral_pub_bytes + receiver_pub_bytes)
        shared_secret = digest.finalize()
        
        # 4. 派生隐身地址
        stealth_seed = receiver_pub_bytes + shared_secret[:8]
        stealth_hash = hashes.Hash(hashes.SHA256())
        stealth_hash.update(stealth_seed)
        stealth_address = base58.b58encode(stealth_hash.finalize()).decode('utf-8')
        
        return stealth_address, base58.b58encode(ephemeral_pub_bytes).decode('utf-8')

    def generate_stealth_address(self, receiver_pub_key):
        """统一调用：自动识别链并生成地址"""
        chain = self.identify_chain(receiver_pub_key)
        if chain == "solana":
            return self.generate_stealth_address_solana(receiver_pub_key)
        else:
            return self.generate_stealth_address_evm(receiver_pub_key)
