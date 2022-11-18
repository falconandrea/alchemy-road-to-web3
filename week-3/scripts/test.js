// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')

// Returns the Ether balance of a given address
async function getBalance (address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address)
  return hre.ethers.utils.formatEther(balanceBigInt)
}

// Logs the Ether balances for a list of addresses
async function printBalances (addresses) {
  let id = 0
  for (const address of addresses) {
    console.log(`Address ${id} balance: `, await getBalance(address))
    id++
  }
}

async function main () {
  // Get the contract to deploy and deploy it
  const ChainBattles = await hre.ethers.getContractFactory('ChainBattles')
  const chainBattles = await ChainBattles.deploy()
  await chainBattles.deployed()
  console.log('ChainBattles deployed to ', chainBattles.address)

  await chainBattles.mint()

  const characterInfo = await chainBattles.getInfoCharacter(1)
  console.log('characterInfo base64', characterInfo)
  const characterURI = await chainBattles.getTokenURI(1)
  console.log('characterURI base64', characterURI)

  await chainBattles.train(1)

  const characterInfoAfter = await chainBattles.getInfoCharacter(1)
  console.log('characterInfo base64 after train', characterInfoAfter)
  const characterURIAfter = await chainBattles.getTokenURI(1)
  console.log('characterURI base64 after train', characterURIAfter)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
