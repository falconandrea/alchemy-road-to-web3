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

// Prinst list of memos
async function printMemos (memos) {
  for (const memo of memos) {
    const timestamp = memo.time
    const tipper = memo.name
    const tipperAddress = memo.from
    const message = memo.message
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}" `)
  }
}

async function main () {
  // Get example accounts
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners()

  // Get the contract to deploy and deploy it
  const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee')
  const buyMeACoffee = await BuyMeACoffee.deploy()
  await buyMeACoffee.deployed()
  console.log('BuyMeACoffee deployed to ', buyMeACoffee.address)

  // Check balances before the coffee purchase
  const addresses = [owner.address, tipper.address, buyMeACoffee.address]
  console.log('>> Start <<')
  await printBalances(addresses)

  // Buy the owner a few coffees
  const tip = { value: hre.ethers.utils.parseEther('1') }
  await buyMeACoffee.connect(tipper).buyCoffee('Mario', 'Example message', tip)
  await buyMeACoffee.connect(tipper2).buyCoffee('Luigi', 'Random message', tip)
  await buyMeACoffee.connect(tipper3).buyCoffee('Simone', 'Awesome message', tip)

  // Check balances after coffee purchase
  console.log('>> After tips <<')
  await printBalances(addresses)

  // Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips()

  // Check balance after withdraw
  console.log('>> After withdraw tips <<')
  await printBalances(addresses)

  // Read all the memos left for the owner
  console.log('>> Memos <<')
  const memos = await buyMeACoffee.getMemos()
  printMemos(memos)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
