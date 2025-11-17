import { useState, useEffect } from 'react'
import { BrowserProvider, JsonRpcSigner, type Eip1193Provider } from 'ethers'
import { appKit } from './appkit/config'
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react'
import Balance from './components/Balance.tsx'
import Increment from './components/Increment.tsx'
import Decrement from './components/Decrement.tsx'
import ReadCounter from './components/ReadCounter.tsx'

export default function Popup() {
  const { address, isConnected } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const { walletProvider } = useAppKitProvider<Eip1193Provider>('eip155')

  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [contractAddress, setContractAddress] = useState('0x669AdfAbFd880A86c042B14bCb16De193a91e2bc')

  // Update signer when provider changes
  useEffect(() => {
    const updateSigner = async () => {
      if (walletProvider && address) {
        try {
          const provider = new BrowserProvider(walletProvider)
          const signerInstance = await provider.getSigner()
          setSigner(signerInstance)
        } catch (error) {
          console.warn('Error creating signer:', error)
          setSigner(null)
        }
      } else {
        setSigner(null)
      }
    }
    updateSigner()
  }, [walletProvider, address])

  const handleConnect = async () => {
    try {
      // Open Reown AppKit modal
      appKit.open()
    } catch (error) {
      console.warn('Error connecting wallet:', error)
    }
  }

  const handleSwitchNetwork = async () => {
    try {
      // Use AppKit to switch network
      appKit.open({ view: 'Networks' })
    } catch (error) {
      console.warn('Error switching network:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await appKit.disconnect()
      setSigner(null)
    } catch (error) {
      console.warn('Error disconnecting:', error)
    }
  }

  return (
    <div style={{
      width: '350px',
      maxWidth: '350px',
      minWidth: '350px',
      height: '600px',
      maxHeight: '600px',
      minHeight: '600px',
      padding: '16px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold' }}>
        Reown Web3 Extension
      </h1>

      {/* Connect Wallet */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {!isConnected ? (
          <button
            onClick={handleConnect}
            style={{
              padding: '10px 16px',
              backgroundColor: '#3396FF',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <button
              onClick={handleDisconnect}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Switch Network */}
      <button
        onClick={handleSwitchNetwork}
        disabled={!isConnected}
        style={{
          padding: '10px 16px',
          backgroundColor: isConnected ? '#9C27B0' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isConnected ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Network (now {chainId}, needs 80002)
      </button>

      {/* Contract Address Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>
          Contract Address
        </label>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="0x..."
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace'
          }}
        />
      </div>

      {/* Read Balance */}
      <Balance address={address} isConnected={isConnected} />

      {/* Increment */}
      <Increment 
        contractAddress={contractAddress}
        signer={signer}
        isConnected={isConnected}
      />

      {/* Decrement */}
      <Decrement 
        contractAddress={contractAddress}
        signer={signer}
        isConnected={isConnected}
      />

      {/* Read Counter */}
      <ReadCounter 
        contractAddress={contractAddress}
        signer={signer}
        isConnected={isConnected}
      />
    </div>
  )
}
