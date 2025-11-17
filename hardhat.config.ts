import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// accounts for local tests (hardhat network)
const account1 = { privateKey: '0x4a450ba399d6ba1234762576f528455c7b353e0614f18dca435da0f1f67cb4f2', balance: '40200000000000000000000' }
const account2 = { privateKey: '0x74e0257f272e29f1ad26df3c3b39898b50d6f0eaf34c301558afdcb69ac221f4', balance: '40200000000000000000000' }
const account3 = { privateKey: '0x332fee756f7f14aff8186c07ddaaface5db59b0158ddb4c9964e59e82b103ae1', balance: '40200000000000000000000' }
const account4 = { privateKey: '0x2b93cb218ff60e7972aed9c98ad8367fd2b715b6b4042cc1598f03a3df92c682', balance: '40200000000000000000000' }
const account5 = { privateKey: '0x7fb469f439e2300eb21cf4620fcf9dba43aac6195440ea87e8e59350026d8b26', balance: '40200000000000000000000' }

// private key for production
// you may find sample of this file in .keys.example.json
import keys from './.keys.json';

const config: HardhatUserConfig = {
  solidity: {
    compilers:[{
      version: "0.8.28",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1331,
        },
        evmVersion: "paris", // This line changes the EVM target
      }
    }],
  },
  // Add your network configurations here
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 127002,
      accounts: [ account1, account2, account3, account4, account5 ]
    },
    // polygon: {
    //   url: "https://polygon-rpc.com",
    //   chainId: 137,
    //   accounts: [ account1, account2, account3, account4, account5 ]
    // },
    amoy: {
      url: "https://rpc-amoy.polygon.technology",
      chainId: 80002,
      accounts: [ keys.amoy ]
    }
  },
  paths: {
    sources: './contracts',
    tests: './test-hh',
    artifacts: './hardhat/artifacts',
    cache: './hardhat/cache',
    ignition: './ignition',
    root: './'
  },
  // Typechain configuration
  typechain: {
    outDir: "./hardhat/types",
    target: "ethers-v6",
  },
};

export default config;
