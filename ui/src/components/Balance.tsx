import { useState } from 'react'
import { useAppKitBalance } from '@reown/appkit/react'

export default function Balance({ address, isConnected }: { address: string | undefined, isConnected: boolean }) {
  const { fetchBalance } = useAppKitBalance()
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null, message: string | null }>({ type: null, message: null })
  const [loading, setLoading] = useState(false)

  const handleReadBalance = async () => {
    if (!isConnected || !address) {
      setStatus({ type: 'error', message: 'Wallet not connected' })
      return
    }
    
    setLoading(true)
    setStatus({ type: 'loading', message: 'Fetching balance...' })
    
    try {
      const result = await fetchBalance()
      if (result.isSuccess && result.data) {
        const balanceValue = result.data.balance
        const symbol = result.data.symbol || 'MATIC'
        const message = `Balance: ${balanceValue} ${symbol}`
        console.log(message)
        setStatus({ type: 'success', message })
      } else {
        const errorMessage = result.error || 'Failed to fetch balance'
        setStatus({ type: 'error', message: errorMessage })
        console.warn('Error fetching balance:', result.error)
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error reading balance'
      setStatus({ type: 'error', message: errorMessage })
      console.warn('Error reading balance:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <button
        onClick={handleReadBalance}
        disabled={!isConnected || loading}
        style={{
          padding: '10px 16px',
          backgroundColor: isConnected && !loading ? '#4CAF50' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isConnected && !loading ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Read Balance
      </button>
      {status.message && (
        <div style={{
          fontSize: '12px',
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

