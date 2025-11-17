import { useState } from 'react'
import { createContractService } from '../services/contractService'
import { JsonRpcSigner } from 'ethers'

export default function ReadCounter({ contractAddress, signer, isConnected }: { contractAddress: string, signer: JsonRpcSigner | null, isConnected: boolean }) {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null, message: string | null }>({ type: null, message: null })
  const [loading, setLoading] = useState(false)

  const handleReadCounter = async () => {
    if (!isConnected || !contractAddress || !signer) {
      setStatus({ type: 'error', message: 'Missing required fields' })
      return
    }

    setLoading(true)
    setStatus({ type: 'loading', message: 'Reading...' })
    
    try {
      const service = createContractService(signer, contractAddress)
      if (!service) {
        throw new Error('Failed to create contract service')
      }
      
      const result = await service.readValue()
      const countValue = result.toString()
      const message = `Count: ${countValue}`
      setStatus({ type: 'success', message })
      console.log(message)
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to read count'
      setStatus({ type: 'error', message: errorMessage })
      console.warn('Error in read counter:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
        Read Counter
      </div>
      <button
        onClick={handleReadCounter}
        disabled={!isConnected || !contractAddress || loading}
        style={{
          padding: '8px 16px',
          backgroundColor: isConnected && contractAddress && !loading ? '#2196F3' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: isConnected && contractAddress && !loading ? 'pointer' : 'not-allowed',
          fontSize: '14px'
        }}
      >
        Read Counter
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

