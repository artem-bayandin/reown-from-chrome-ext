# Hello, world

## What is this

The app is a POC sample of how to use reown appkit inside a chrome extension. As a smart contract, a very simple contract with internal counter was deployed and veified to Amoy testnet at `0x669AdfAbFd880A86c042B14bCb16De193a91e2bc` ([amoy scan](https://amoy.polygonscan.com/address/0x669AdfAbFd880A86c042B14bCb16De193a91e2bc)). [Faucet link](https://faucet.stakepool.dev.br/amoy).

Prerequisites: hardhat needs keys, there are keys for localhost, and for Amoy network HH reads the key from .keys.json (which is not available) - you may copy-paste .keys.example.json or manually add a private key to hardhat.config.ts.

You also need some test tokens - visit faucet https://faucet.stakepool.dev.br/amoy 

Metamask extension 13.8.0 is used in browser

Link to reown bug: https://github.com/reown-com/appkit/issues/5359

### Current state:

- connects using QR code scanned from iPhone Metamask app;
- reads balance (using inbuilt appkit functionality);
- reads from smart contract (reads counter).

### Issues:

#### Case 1 (critical): Writing to smart contract

- steps: Open the extension, connect your wallet, click "read balance" to see it somehow works, click "read counter" to see it reads from smart contract, then click "increment" or "decrement".
- actual: Nothing will happen, and in console you will see a 400 BadRequest error `GET https://verify.walletconnect.org/v3/attestation?projectId=357f587eff1593dd05c9ce099737ab92&origin=chrome-extension://iflfpafchabnngjeanbgjnapfahmglme&id=2f094c141fbe4bd5d29858506e0c299c00000000000000000000000000000000&decryptedId=c5b3da59cc8700ee36228b29abee243400000000000000000000000000000000`
- expected: Metamask extension opens to sign a transaction (or at least a QR code appears to scan from mobile)
`GET https://verify.walletconnect.org/v3/attestation?projectId=357f587eff1593dd05c9ce099737ab92&origin=chrome-extension://iflfpafchabnngjeanbgjnapfahmglme&id=2f094c141fbe4bd5d29858506e0c299c00000000000000000000000000000000&decryptedId=c5b3da59cc8700ee36228b29abee243400000000000000000000000000000000`

#### Case 2 (high priority): Whitelisting `chrome-extension://{EXT_ID}` origin in Reown dashboard

- I'd like to limit usage of my project_id just to my extension;
- steps: go to Reown dashboard https://dashboard.reown.com/ , navigate to Domains, click to add a domain, insert `chrome-extension://iflfpafchabnngjeanbgjnapfahmglme`
- actual: Error: `Please enter a valid domain or URL`
- expected: origin added

#### Case 3 (high priority): Connect to Metamask extension as well as using QR code for mobile Metamask app

- working in a browser, I'd like it to be browser-first, with no need to use mobile Metamask app to connect to my extension
- steps: Open my extension, click Connect button, select Metamask wallet, toggle "browser" instead of "QR code"
- actual: Error: `Not detected`
- expected: Metamask browser extension is triggered/opened

#### Case 4 (mid priority): Switching networks

- prerequisites: both Polygon and Amoy networks are added to both Metamask browser extension and Metamask iPhone app
- steps: Open my extension, connect, click "Network" button, select Polygon or Amoy (both predefined)
- actual: Seems that network is switched, at least ID of current network changes, but there is an error on UI: `Your connected wallet may not support some of the networks available for this dApp`
- expected: Network is switched with no such error

#### Case 5 (low priority): Some errors in console, might be related to signing transactions

- when reading from smart contract, it reads the value, but there is an error in console, which shows `400 Bad Request` for this call `POST https://rpc.walletconnect.org/v1/?chainId=eip155%3A80002&projectId=357f587eff1593dd05c9ce099737ab92`with payload `{id: 1, jsonrpc: "2.0", method: "test", params: []}`

#### Case 6 (fantom bug) (low priority): Unable to read from smart contract (failed to find stable reproducable logic). Might be some cache mechanism failure or so.

- Open extension, connect wallet, read balance, read value from smart contract - works fine.
- Close extension, open extension (you will see that you are connected), click to read value from smart contract - error:
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

- Expected to see the value from smart contract.

- Sometimes, it reads the data.
- Disconnect, and then connect, not closing the extension - sometimes it fails.
- Disconnect, close extension, open extension, connect - sometimes it fails.
- Disconnect, close extension, reload the extension, open, connect - this always worked.

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

There are 3 smart contracts deployed on Amoy for you:
- `0x669AdfAbFd880A86c042B14bCb16De193a91e2bc` (verified),
- `0x4Dc134793D7987a1bbD948804529AeCAF7c197C6` (verified),
- `0xA7971197438fC51177440345e9A6Dad5b37BBA49` (not verified). Although it seems that contract verification does not matter.

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
