# NFT Image App
Mint, transfer, receive ERC721 NFT tokens on Ethereum Blockchain 

## Requirements

- NodeJS
- Truffle
- Ganache
- Metamask


## Setup

Run Ganache (Personal Eth Blockchain) then install our app dependencies.

```
npm install
```

Create a local network on Metamask and import our private keys from Ganache.

## Start our ReactJs App

```
npm start
```

Connect your Metamask account when prompted

## Start Minting your own NFT tokens

Upload jpg or png image and start minting your nft tokens. Images will be upload to [ipfs](https://ipfs.io/). The hash return by ipfs provider will be stored in the eth blockchain via our own NFT Image Contract that complies with ERC721 standard.

> Make sure you are on your ganache local network to avoid spending your Eth coins.
