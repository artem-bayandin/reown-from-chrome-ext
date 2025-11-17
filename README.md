# Hello, world

## What is this

The app is a POC sample of how to use reown appkit inside a chrome extension. As a smart contract, a very simple contract with internal counter was deployed and veified to Amoy testnet at `0x669AdfAbFd880A86c042B14bCb16De193a91e2bc` ([amoy scan](https://amoy.polygonscan.com/address/0x669AdfAbFd880A86c042B14bCb16De193a91e2bc)). [Faucet link](https://faucet.stakepool.dev.br/amoy).

Current state:
- connects using QR code;
- reads balance (using inbuilt appkit functionality);
- reads from smart contract (reads counter).

Does not work:
- cannot connect using Metamask extension in browser. When selecting "browser" version instead of "QR code" shows "Not detected";
- cannot write to smart contract (all transactions fail with `Failed to load resource: the server responded with a status of 400`). The next request fails (some codes are replaced with 0):
https://verify.walletconnect.org/v3/attestation?projectId=357f587eff1593dd05c9ce099737ab92&origin=chrome-extension://iflfpafchabnngjeanbgjnapfahmglme&id=2f094c141fbe4bd5d29858506e0c299c00000000000000000000000000000000&decryptedId=c5b3da59cc8700ee36228b29abee243400000000000000000000000000000000
- for some reason, after the contract was verified on amoyscan, reading value also throws an error: 
```
{
    "code": "BAD_DATA",
    "value": "0x",
    "info": {
        "method": "count",
        "signature": "count()"
    },
    "shortMessage": "could not decode result data"
}
```

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

00. you need metamask app installed on your phone, as reown does not connects from extension to extension
0. go to `/ui` folder: `cd ui`
1. verify `/src/appkit/config.ts`:
   - projectId from reown dashboard;
   - `metadata.url` to be url of your loaded extension (when you `load as unpacked` in google chrome extensions);
   - `App.tsx` - contract address should be the address from smart contracts setup (now set);
   - definitely, smart contracts should be compiled, as ui needs types and artifacts.
2. `npm install`
3. `npm run build:dev` (you may also build without dev, as dev just does not minifies)
4. go to google chrome extensions page `chrome://extensions`, click `load unpacked`, and then select `dist` folder from `ui`
