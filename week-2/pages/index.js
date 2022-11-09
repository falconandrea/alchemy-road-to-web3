import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react'

import abi from '../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json'
import { ethers } from 'ethers'
import config from '../config'

export default function Home () {
  const contractAddress = config.CONTRACT_ADDRESS
  const contractABI = abi.abi

  // Component state
  const [currentAccount, setCurrentAccount] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [memos, setMemos] = useState([])
  const [showWaitingMessage, setShowWaitingMessage] = useState(false)

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value)
  }

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      console.log('accounts: ', accounts)

      if (accounts.length > 0) {
        const account = accounts[0]
        console.log('wallet is connected! ' + account)
      } else {
        console.log('make sure MetaMask is connected')
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Please install MetaMask')
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const buyCoffee = async (type) => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any')
        const signer = provider.getSigner()

        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        console.log('buying coffee..')

        setShowWaitingMessage(true)

        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name || 'anon',
          message || 'Enjoy your coffee!',
          { value: type === 'large' ? ethers.utils.parseEther('0.003') : ethers.utils.parseEther('0.001') }
        )

        await coffeeTxn.wait()
        console.log('mined ', coffeeTxn.hash)
        console.log('coffee purchased!')

        setShowWaitingMessage(false)

        // Reload memos
        getMemos()

        // Clear the form fields.
        setName('')
        setMessage('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        console.log('fetching memos from the blockchain..')
        const memos = await buyMeACoffee.getMemos()
        console.log('fetched!')
        console.log('MEMOS', memos)
        setMemos(memos)
      } else {
        console.log('Metamask is not connected')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let buyMeACoffee
    isWalletConnected()
    getMemos()

    // Create an event handler function for when someone sends us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log('Memo received: ', from, timestamp, name, message)
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ])
    }

    const { ethereum } = window

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, 'any')
      const signer = provider.getSigner()
      buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )

      buyMeACoffee.on('NewMemo', onNewMemo)
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off('NewMemo', onNewMemo)
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Buy Me a Coffee</title>
        <meta name='description' content='Buy me a coffee Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Buy me a Coffee
        </h1>

        {currentAccount
          ? (
            <div className={styles.containerForm}>
              <form>
                <div className={styles.formgroup}>
                  <label htmlFor='name'>
                    Name:
                  </label>
                  <input
                    id='name'
                    type='text'
                    placeholder='Anon User'
                    onChange={onNameChange}
                  />
                </div>
                <br />
                <div className={styles.formgroup}>
                  <label htmlFor='message'>
                    Leave a message:
                  </label>
                  <textarea
                    rows={3}
                    placeholder='Enjoy your coffee!'
                    id='message'
                    onChange={onMessageChange}
                    required
                  />
                </div>
                <div>
                  <button
                    type='button'
                    onClick={() => buyCoffee('small')}
                  >
                    Send 1 Coffee for 0.001ETH
                  </button>
                  <small>or</small>
                  <button
                    type='button'
                    onClick={() => buyCoffee('large')}
                  >
                    Send 1 Large Coffee for 0.003ETH
                  </button>
                </div>
                {showWaitingMessage && (<p id='waitingMessage' className={styles.titleMemos}>Waiting...</p>)}
              </form>
            </div>
            )
          : (
            <button className={styles.connectWalletButton} onClick={connectWallet}> Connect your wallet </button>
            )}
      </main>

      {currentAccount && (<h2 className={styles.titleMemos}>Memos received</h2>)}

      {currentAccount && memos.length === 0 && (<span className={styles.noMemosMessage}>No memos sent.</span>)}

      {currentAccount && (memos.map((memo, idx) => {
        return (
          <div key={idx} className={styles.memo}>
            <strong>"{memo.message}"</strong>
            <p>From: {memo.name} at {memo.time ? memo.time.toString() : ''}</p>
          </div>
        )
      }))}

      <footer className={styles.footer}>
        <a
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src='/vercel.svg' alt='Vercel Logo' width={72} height={16} />
          </span>
        </a>
        <br />
        <a href='https://github.com/falconandrea' title='' rel='noopener noreferrer' target='_blank'>My Github</a>
      </footer>
    </div>
  )
}
