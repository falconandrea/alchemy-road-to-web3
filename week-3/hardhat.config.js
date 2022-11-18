require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')
require('@nomiclabs/hardhat-etherscan')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    mumbai: {
      url: process.env.NETWORK_RPC,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  }
}
