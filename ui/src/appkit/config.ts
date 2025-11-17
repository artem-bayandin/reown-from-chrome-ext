import { createAppKit, type ConnectMethod, type CreateAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { type AppKitNetwork, polygon, polygonAmoy } from '@reown/appkit/networks'

// reown dashboard: https://dashboard.reown.com/

// 1. Get projectId
const projectId = "357f587eff1593dd05c9ce099737ab92";

// 2. Set the networks
const networks = [ polygon, polygonAmoy ] as [AppKitNetwork, ...AppKitNetwork[]];

// 3. Create a metadata object - optional
const metadata = {
    name: "Reown within Chrome extension sample",
    description: "descr goes here",
    url: 'chrome-extension://iflfpafchabnngjeanbgjnapfahmglme',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const appKitConfig: CreateAppKit = {
    adapters: [new EthersAdapter()],
    networks,
    metadata,
    projectId,
    features: {
        analytics: false,
        swaps: false,
        onramp: false,
        connectMethodsOrder: ['wallet'] as ConnectMethod[],
        legalCheckbox: false,
    },
    defaultNetwork: polygonAmoy,
    featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // metamask
    ],
    enableWallets: true,
    enableNetworkSwitch: true,
    enableReconnect: true,
    enableWalletGuide: true,
    // universalProviderConfigOverride: {
    //     methods: { eip155: ['eth_sendTransaction', 'personal_sign', 'chain_id'] },
    //     chains: { eip155: ['1', '137', '80002'] },
    //     events: { eip155: ['chainChanged', 'accountsChanged'] },
    //     // rpcMap: { eip155:1: 'https://ethereum.publicnode.com' },
    //     // defaultChain: 'eip155:1'
    // },
    // enableEIP6963: true,
    // allowUnsupportedChain: false,
}

// 4. Create a AppKit instance
export const appKit = createAppKit(appKitConfig)
