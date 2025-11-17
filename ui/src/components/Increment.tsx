import { useState } from 'react'
import { createContractService } from '../services/contractService'
import { JsonRpcSigner } from 'ethers'

export default function Increment({ contractAddress, signer, isConnected }: { contractAddress: string, signer: JsonRpcSigner | null, isConnected: boolean }) {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null, message: string | null }>({ type: null, message: null })
  const [loading, setLoading] = useState(false)

  const handleIncrement = async () => {
    if (!isConnected || !contractAddress || !signer) {
      setStatus({ type: 'error', message: 'Missing required fields' })
      return
    }

    setLoading(true)
    setStatus({ type: 'loading', message: 'Processing...' })
    
    try {
      const service = createContractService(signer, contractAddress)
      if (!service) {
        throw new Error('Failed to create contract service')
      }
      
      await service.increment()
      setStatus({ type: 'success', message: 'Counter incremented successfully' })
      console.log('Counter incremented successfully')
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to increment counter'
      setStatus({ type: 'error', message: errorMessage })
      console.warn('Error in increment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
        Increment
      </div>
      <button
        onClick={handleIncrement}
        disabled={!isConnected || !contractAddress || loading}
        style={{
          padding: '8px 16px',
          backgroundColor: isConnected && contractAddress && !loading ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isConnected && contractAddress && !loading ? 'pointer' : 'not-allowed',
          fontSize: '14px'
        }}
      >
        Increment
      </button>
      {status.message && (
        <div style={{
          fontSize: '14px',
          padding: '8px',
          backgroundColor: 'white',
          borderRadius: '4px',
          color: status.type === 'success' ? '#4CAF50' : status.type === 'error' ? '#f44336' : '#FFC107'
        }}>
          {status.message}
        </div>
      )}
    </div>
  )
}

