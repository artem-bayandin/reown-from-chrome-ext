import { Contract, JsonRpcSigner } from 'ethers'

// ABI generated from function signatures
import { abi as TestCounterABI } from '../../../sol/hardhat/artifacts/contracts/TestCounter.sol/TestCounter.json'
import { type TestCounter } from '../../../sol/hardhat/types/TestCounter'

/**
 * Contract service for role management
 * @param {import('ethers').Signer} signer - Ethers signer from Reown
 * @param {string} contractAddress - Contract address
 * @returns {Object} Contract service methods
 */
export function createContractService(signer: JsonRpcSigner, contractAddress: string) {
  if (!signer) {
    console.warn('Contract service: No signer provided')
    return null
  }

  if (!contractAddress) {
    console.warn('Contract service: No contract address provided')
    return null
  }

  const contract = new Contract(contractAddress, TestCounterABI, signer) as any as TestCounter

  return {
    async increment() {
        try {
            console.log(`Incrementing...`)
            const tx = await contract.increment()
            console.log('Increment transaction sent:', tx.hash)
            const receipt = await tx.wait()
            console.log('Increment transaction confirmed:', receipt?.hash)
            return receipt
        } catch (error: any) {
            console.warn('Error incrementing:', error.message)
            throw error
        }
    },

    async decrement() {
        try {
            console.log(`Decrementing...`)
            const tx = await contract.decrement()
            console.log('Decrement transaction sent:', tx.hash)
            const receipt = await tx.wait()
            console.log('Decrement transaction confirmed:', receipt?.hash)
            return receipt
        } catch (error: any) {
            console.warn('Error decrementing:', error.message)
            throw error
        }
    },

    async readValue() {
        try {
            console.log(`Reading current counter value...`)
            const result = await contract.count()
            console.log(`Current value: ${result}`)
            return result
          } catch (error: any) {
            console.warn('Error reading current value:', error.message)
            throw error
          }
    }
  }
}
