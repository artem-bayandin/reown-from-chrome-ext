import { ethers } from 'hardhat'
import { abi as TestCounterABI } from '../hardhat//artifacts/contracts/TestCounter.sol/TestCounter.json'
import { TestCounter } from '../hardhat/types/TestCounter'
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'

// contract at 0x669AdfAbFd880A86c042B14bCb16De193a91e2bc

async function main() {
    console.log(`I am a worker!`)
    const [signer] = await ethers.getSigners()
    const signerAddress = await signer.getAddress()
    console.log('signer', signerAddress)

    const address = await deploy()

    await readValue(address, signer)

    await increment(address, signer)

    await readValue(address, signer)
}

async function deploy(): Promise<string> {
    const TestCounterFactory = await ethers.getContractFactory('TestCounter')
    const testCounter = await TestCounterFactory.deploy()
    await testCounter.waitForDeployment()
    const deployTx = testCounter.deploymentTransaction()
    const deployReceipt = await deployTx?.wait()
    console.log('deployed')
    const testCounterAddress = await testCounter.getAddress()
    console.log('test counter address', testCounterAddress)
    return testCounterAddress
}

function getContract(address: string, signer: HardhatEthersSigner): TestCounter {
    return new ethers.Contract(address, TestCounterABI, signer) as any as TestCounter
}

async function readValue(address: string, signer: HardhatEthersSigner): Promise<bigint> {
    const contract = getContract(address, signer)
    const value = await contract.count()
    console.log('read value', value)
    return value
}

async function increment(address: string, signer: HardhatEthersSigner): Promise<void> {
    const contract = getContract(address, signer)
    const tx = await contract.increment()
    const receipt = await tx.wait()
    console.log('incremented')
}

async function decrement(address: string, signer: HardhatEthersSigner): Promise<void> {
    const contract = getContract(address, signer)
    const tx = await contract.decrement()
    const receipt = await tx.wait()
    console.log('decremented')
}

/* MAIN FUNCTION */

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
    // Run the deployment
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error)
            process.exit(1)
        })
}
