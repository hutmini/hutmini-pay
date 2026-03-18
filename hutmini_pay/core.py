import os
from coincurve import PrivateKey, PublicKey
from eth_utils import keccak, to_checksum_address

class HutStealthEngine:
    """
    HUT-Pay 隐私引擎：基于 coincurve 优化的隐身地址生成
    基于椭圆曲线 Diffie-Hellman (ECDH) 原理
    """
    
    @staticmethod
    def generate_stealth_address(receiver_pub_key_hex):
        """
        发送方调用：为接收方生成一个一次性隐身地址
        :param receiver_pub_key_hex: 接收方的永久公钥 (64字节 raw 或 65字节 uncompressed)
        :return: (stealth_address, ephemeral_pub_key_hex)
        """
        # 1. 生成一个临时的私钥 (Ephemeral Key)
        ephemeral_priv = PrivateKey(os.urandom(32))
        ephemeral_pub_hex = ephemeral_priv.public_key.format().hex()

        # 2. 处理接收方公钥格式
        pub_hex = receiver_pub_key_hex.replace('0x', '')
        if len(pub_hex) == 128:
            pub_hex = '04' + pub_hex # coincurve expects 04 prefix for uncompressed
        
        try:
            receiver_pub = PublicKey(bytes.fromhex(pub_hex))
        except Exception as e:
            raise ValueError(f"Invalid public key format: {str(e)}")

        # 3. 计算共享密钥 (Shared Secret) via ECDH
        shared_secret = ephemeral_priv.ecdh(receiver_pub.format())
        
        # 4. 对共享密钥进行哈希，生成偏移量 (Stealth Meta)
        view_tag = keccak(shared_secret)
        
        # 5. 生成隐身地址 (DEMO 简化逻辑)
        # 生产环境下应使用点加运算：Stealth_Pub = Receiver_Pub + keccak(Shared_Secret) * G
        # 这里遵循白皮书草案中的哈希派生演示逻辑
        stealth_pub_seed = receiver_pub.format(compressed=False)[1:] + view_tag
        stealth_hash = keccak(stealth_pub_seed)
        stealth_address = to_checksum_address(stealth_hash[-20:])
        
        return stealth_address, ephemeral_pub_hex
