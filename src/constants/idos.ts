export const IDO_STATUS_UPCOMING = 'Upcoming'
export const IDO_STATUS_ENDED = 'Ended'

interface AnnouncedIDOItem {
  id: number
  title: string
  symbol: string
  price: string
  description: string
  status: string
  target: number
  tokenAddress: string
  announcementUrl?: string
  projectIconLocation: string
  projectUrl: string
  whitelistRound?: string
  publicRound?: string
  saleEnds?: string
}

export const IDO_LIST: Array<AnnouncedIDOItem> = [
  {
    id: 1,
    title: 'OmeletteSwap',
    symbol: 'OMLT',
    price: '0.006',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: IDO_STATUS_UPCOMING,
    target: 100000000,
    tokenAddress: '0x0',
    projectIconLocation: require('../assets/images/omelette_logo.png'),
    projectUrl: 'https://twitter.com/omeletteswap',
    whitelistRound: '',
    publicRound: '',
    saleEnds: ''
  }
  /*   {
    id: 2,
    title: 'OmeletteSwap',
    symbol: 'OMLT',
    price: '0.006',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: IDO_STATUS_ENDED,
    target: 100000000,
    tokenAddress: '0x0',
    projectIconLocation: require('../assets/images/omelette_logo.png'),
    projectUrl: 'https://twitter.com/omeletteswap',
    whitelistRound: '',
    publicRound: '',
    saleEnds: ''
  } */
]
