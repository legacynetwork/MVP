# Legacy's MVP


Legacy's MVP is a dApp built on the Ethereum blockchain that implements a *decentralised dead man's switch*. Its main functionalities are:

- Sending funds from a user smart contract to a given set of recipient Ethereum addresses (aka as beneficiaries).

- Sending encrypted messages to a given set of recipients.

The funds are only accessible by the corresponding beneficiaries after the user contract shows no sign of activity over a predefined time period `tPoL`, at which point we assume that the user has passed. 

## Encryption/Decryption System
Files are encrypted and stored in IPFS nodes. Two encryption layers are applied: the first uses a symmetric key which is only known by the corresponding recipient `i`. The second uses a shared key stored by a set of `n` *secret keepers*, following Shamir's secret sharing algorithm.  So if `n` the number of keepers, then the shared key can be retrieved if and only if `k` out of `n` key shares are provided by the keepers. The parameter `k` (`1 <= k <= n`) is defined by the user upon system setup.


**WARNING**: This application is only a proof of concept and should not be used on the Ethereum mainnet. The code is still under development and has not been correctly tested nor audited. Use at your own responsibility.

## Build Setup

``` bash
# install dependencies
npm install

# Launch Ganache

# Deploy smart contracts
truffle compile

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

MVP link:
chainimpact.io/legacy/index.html
(use only with ropsten/rinkeby or other testnet)
