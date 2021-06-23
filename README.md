# StormX Shrug NFT Experiment

## Overview

Smart contract for shurg nft experiment.
#### 1. Shrug NFT for shrug images
Each shrug image is represented by Shrug NFT which includes ownership, detailed information. The information of token is saved on IPFS as json format and it includes the IPFS uri of shrug image.
##### 2. Shrug Sale for selling tokens to users
Users can buy Shrug NFT with ETH, STMX, USDT and the price of each token is calculated by contract which is based on exponential bonding curve logic. The max supply of Shrug NFT is 500 as constant.
Shrug NFT project interacts with ChainLink price feed aggregators to retrieve latest price of assets to increase security and decrease vulnerability points like flash loan attack.

## Addresses of deployed contract on rinkeby network
``ShrugNFT``: 0x90cF3d432F84f6696107E378d5D848C9A738db07

``ShrugSale``:  0xA96F2d842A40EA29411CE34B1544a2253f0c8011

## Addresses of deployed contract on mainnet

*TODO: Add mainnet smart contract addresses*

## Deployment

### Environment Setup

1. First clone this repository to your computer.
```
$ git clone ...
$ cd nft-experiment
```
2. Then install the node modules.
```
$ npm install
```
3. Create secret.mainnet.json & secret.testnet.json in root directory. Fill out all info needed on those files in according to secret.example.json.
```
{
  "mnemonic": "",
  "infura_api_key": "",
  "recipient1_address": "",
  "recipient2_address": "",
  "usdt_token_address": "",
  "stmx_token_address": "",
  "eth_usd_aggregator_address": "",
  "stmx_usd_aggregator_address": "",
  "usdt_usd_aggregator_address": ""
}

```

### Deploy to Local Machine

1. Run development server using Truffle.
```
$ truffle develop
```

2. Deploy contracts.
```
$ truffle migrate
```

### Deploy to Testnet (Rinkeby)

```
$ truffle migrate --network testnet
```

### Deploy to Mainnet

```
$ truffle migrate --network mainnet
```

## References

1. Truffle Commands: https://www.trufflesuite.com/docs/truffle/reference/truffle-commands

2. ERC-721: https://eips.ethereum.org/EIPS/eip-721

3. IPFS https://ipfs.io/

4. Bonding Curve https://coinmarketcap.com/alexandria/glossary/bonding-curve#:~:text=A%20bonding%20curve%20is%20a%20mathematical%20concept%20used%20to%20describe,pay%20slightly%20more%20for%20it.

5. ChainLink Ethereum Price Feeds. https://docs.chain.link/docs/ethereum-addresses/

6. Flash loan attack https://coinmarketcap.com/alexandria/article/what-are-flash-loan-attacks 