## How to build "Buy Me a Coffee" DeFi Dapp

**Tutorial**: [Youtube](https://www.youtube.com/watch?v=cxxKdJk55Lk) - [Alchemy Docs](https://docs.alchemy.com/docs/how-to-build-buy-me-a-coffee-defi-dapp)

**What I learn**:

1. Use the [Hardhat](https://hardhat.org/) development environment to build, test, and deploy our smart contract
2. Create APP on [Alchemy](https://alchemy.com) and add Goerli Network on Metamask
3. Deploy our contract on Goerli network with [Hardhat](https://hardhat.org/)
4. Deploy a front-end on [Replit](https://replit.com/)
5. Use [Ethers.js](https://docs.ethers.io) to interact with the contract.

**Commands and output**:

_Run test Buy-Coffee script in local:_

`npx hardhat run scripts/buy-coffee.js`

```
BuyMeACoffee deployed to  0x5FbDB2315678afecb367f032d93F642f64180aa3
>> Start <<
Address 0 balance:  9999.99855650125
Address 1 balance:  10000.0
Address 2 balance:  0.0
>> After tips <<
Address 0 balance:  9999.99855650125
Address 1 balance:  9998.999752294052049657
Address 2 balance:  3.0
>> After withdraw tips <<
Address 0 balance:  10002.998510581269405534
Address 1 balance:  9998.999752294052049657
Address 2 balance:  0.0
>> Memos <<
At 1667844617, Mario (0x70997970C51812dc3A010C7d01b50e0d17dc79C8) said: "Example message"
At 1667844618, Luigi (0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC) said: "Random message"
At 1667844619, Simone (0x90F79bf6EB2c4f870365E785982E1f101E93b906) said: "Awesome message"
```

---

_Deploy the contract on the blockchain without specify a network (on local):_

`npx hardhat run script/deploy.js`

It returns always the same address `0x5FbDB2315678afecb367f032d93F642f64180aa3`

```
BuyMeACoffee deployed to  0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

_Deploy the contract on a specific blockchain (you can insert new networks in the file `hardhat.config.js`):_

`npx hardhat run script/deploy.js --network goerli`

This command deploy the contract on Goerli Blockchain and return the Goerli address. Each time you will run the command, you will deploy the contract to a new address.
You can see it on [Goerli Etherscan](https://goerli.etherscan.io/).

---

_Collect all tips with Withdraw script:_

`npx hardhat run script/withdraw.js`

This command take from `.env` file the contract address deployed with the previous command and the network. If there are funds on the contract, they are sent to the owner wallet.
