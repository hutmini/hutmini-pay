from setuptools import setup, find_packages

setup(
    name="hutmini-pay",
    version="0.1.1",
    author="HUTMINI",
    author_email="admin@hutmini.com",
    description="Official Web3 Payment SDK for AI Agents by HUTMINI.COM",
    long_description=open("README.md", encoding="utf-8").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/hutmini/hut-pay",
    packages=find_packages(),
    install_requires=[
        "web3>=6.0.0",
        "eth-keys>=0.4.0",
        "requests>=2.28.0",
        "eth-utils>=2.0.0",
        "base58>=2.1.0",
        "cryptography>=41.0.0"
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Topic :: Office/Business :: Financial",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    python_requires='>=3.8',
)
