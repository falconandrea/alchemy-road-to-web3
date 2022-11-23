import Head from 'next/head'
import { useState } from 'react'
import { NFTCard } from './components/nftCard'

export default function Home () {
  const [wallet, setWalletAddress] = useState('')
  const [collection, setCollectionAddress] = useState('')
  const [NFTs, setNFTs] = useState([])
  const [fetchCollection, setFetchCollection] = useState(false)
  const [moreKey, setMoreKey] = useState('')
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''

  const fetchNFTs = async (startFrom = '') => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}/`
    let fetchURL = `${baseURL}`

    if (wallet || collection) {
      if (fetchCollection) {
        if (collection.length) {
          fetchURL += `getNFTsForCollection/?contractAddress=${collection}&withMetadata=true`
        }
      } else {
        fetchURL += `getNFTs/?owner=${wallet}`
        if (collection.length) {
          fetchURL += `&contractAddresses%5B%5D=${collection}`
        }
      }

      if (startFrom !== '') fetchURL += '&pageKey=' + startFrom

      const result = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (result.pageKey) setMoreKey(result.pageKey)
      else setMoreKey('')

      if (result && (result.ownedNfts || result.nfts)) {
        setNFTs(NFTs.concat(result.ownedNfts ? result.ownedNfts : result.nfts))
        console.log('result', NFTs)
      }
    }
  }

  return (
    <div>
      <Head>
        <title>NFT Gallery</title>
        <meta name='description' content='Simple NFT gallery' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col items-center py-2'>
        <div className='w-full max-w-xs py-4'>
          <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='wallet'>
                Wallet address
              </label>
              <input disabled={fetchCollection} value={wallet} onChange={e => setWalletAddress(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='wallet' type='text' placeholder='Your wallet address' />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='collection'>
                Collection address
              </label>
              <input value={collection} onChange={e => setCollectionAddress(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' id='collection' type='text' placeholder='You collection address' />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='fetchCollection'>
                <input className='mr-2 leading-tight' value={fetchCollection} id='fetchCollection' onChange={e => setFetchCollection(e.target.checked)} type='checkbox' />
                <span className='text-sm'>
                  Fetch for Collection
                </span>
              </label>
            </div>
            <div className='flex items-center justify-between'>
              <button
                onClick={() => fetchNFTs()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='button'
              >
                Get data
              </button>
            </div>
          </form>
        </div>

        <div className='container my-12 mx-auto px-4 md:px-12'>
          <div className='flex flex-wrap -mx-1 lg:-mx-4'>
            {NFTs.length > 0 && NFTs.map((nft, index) => {
              return (
                <NFTCard key={index} nft={nft} />
              )
            })}
          </div>
          {moreKey !== '' && (
            <button class='mx-auto block rounded-xm border-2 px-4 py-2' onClick={() => fetchNFTs(moreKey)}>Load More</button>
          )}
        </div>
      </main>
    </div>
  )
}
