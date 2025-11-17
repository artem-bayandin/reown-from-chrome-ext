# Hello, world

## How to

The project consists of two parts:
- smart contract sample in `/sol` folder
- UI side with react and reown in `/ui` folder

### Setup smart contract

0. go to `/sol` folder: `cd sol`
1. install dependencies: `npm install`
2. compile smart contract: `npm run hcf`
3. [optional] if you wish, you may deploy it somewhere, or use `0x669AdfAbFd880A86c042B14bCb16De193a91e2bc` address on Amoy network
   - script to deploy, read, write: `./scripts-hh/do.ts`. To run it: `npx hardhat run scripts-hh/do.ts --network NETWORK_NAME`, where `NETWORK_NAME` currently might be `localhost` or `amoy`, as configured in `./hardhat.config.ts`
4. now you may reference `TestCounter` smart contract from UI referencing folder `/sol/hardhat/artifacts` or `types`

### Setup UI
