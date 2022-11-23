
import copyIcon from '../assets/copy-icon.svg'

export const NFTCard = ({ nft }) => {
  return (
    <div className='my-1 px-1 w-full md:w-1/3 lg:my-4 lg:px-4 lg:w-1/4'>
      <img className='w-full' src={nft.media[0].gateway} alt={nft.title} />
      <div className='px-6 py-4'>
        <h4 className='font-bold text-xl'>{nft.title}</h4>
        <p className='mb-2'>
          <a href={`https://etherscan.io/token/${nft.contract.address}`} target='_blank' rel='noreferrer' title='' className='underline'>
            <small>View on Etherscan</small>
          </a>
        </p>
        <p className='text-gray-700 text-base'>
          {nft.id.tokenId.substr(nft.id.tokenId.length - 4)}
        </p>
        <p className='text-gray-700 text-base'>
          {`${nft.contract.address.substr(0, 5)}...${nft.contract.address.substr(nft.contract.address.length - 4)}`}
          <button onClick={() => { navigator.clipboard.writeText(nft.contract.address) }}>
            <img class='w-4 inline-block ml-2 -mt-1' src={copyIcon.src} alt='' />
          </button>
        </p>
        <div className='text-gray-700 text-base mt-4'>
          {nft.description?.substr(0, 90)}...
        </div>
      </div>
    </div>
  )
}
