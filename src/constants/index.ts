import { ChainId, JSBI, Percent, Token, WOMC } from '@uniswap/sdk'

import { injected, walletconnect, walletlink } from '../connectors'

export const ROUTER_ADDRESS = '0xea4CF5ABD0950824aa53d6CCE0C3B2D026a6EA70'

export const MINICHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.OMCHAIN]: '0xBd6416907B7C6b1855c4Fc87818A391AdDEFfE76'
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.OMCHAIN]: new Token(ChainId.OMCHAIN, '0xe0796aaf4057603898d2570a6453c9d1af5beeb4', 18, 'USDT.b', 'Tether USD')
}

export const OMLT: { [chainId in ChainId]: Token } = {
  [ChainId.OMCHAIN]: new Token(
    ChainId.OMCHAIN,
    '0x779Da1B95e81De928fbe9F293629a346f88e86f7',
    18,
    'OMLT',
    'Omelette'
  )
}

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_ONE = JSBI.BigInt(1)
export const BIG_INT_TWO = JSBI.BigInt(2)
export const BIG_INT_TEN = JSBI.BigInt(10)
export const BIG_INT_EIGHTEEN = JSBI.BigInt(18)
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)
export const ONE_TOKEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

export const OMELETTESWAP_API_BASE_URL = 'https://omeletteswap-api.bizbucaliyiz.workers.dev'

export const OMELETTESWAP_TOKENS_REPO_RAW_BASE_URL = `https://raw.githubusercontent.com/omelette-swap`

export type LogoSize = 24 | 48
export const getTokenLogoURL = (address: string) =>
  `${OMELETTESWAP_TOKENS_REPO_RAW_BASE_URL}/main/assets/${address}/logo.png`

const WOMC_ONLY: ChainTokenList = {
  [ChainId.OMCHAIN]: [WOMC[ChainId.OMCHAIN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WOMC_ONLY,
  [ChainId.OMCHAIN]: [...WOMC_ONLY[ChainId.OMCHAIN]]
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WOMC_ONLY,
  [ChainId.OMCHAIN]: [
    ...WOMC_ONLY[ChainId.OMCHAIN],
    USDT[ChainId.OMCHAIN],
    OMLT[ChainId.OMCHAIN]
  ]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WOMC_ONLY,
  [ChainId.OMCHAIN]: [
    ...WOMC_ONLY[ChainId.OMCHAIN],
    USDT[ChainId.OMCHAIN],
    OMLT[ChainId.OMCHAIN]
  ]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  // [ChainId.OMCHAIN]: [
  //   [USDT, WOMC[ChainId.OMCHAIN]]
  /*     [USDC, USDT],
    [DAI, USDT] */
  // ]
}

const TESTNET_CAPABLE_WALLETS = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}

export const SUPPORTED_WALLETS =
  process.env.REACT_APP_CHAIN_ID !== '21816'
    ? TESTNET_CAPABLE_WALLETS
    : {
        ...TESTNET_CAPABLE_WALLETS,
        ...{
          WALLET_CONNECT: {
            connector: walletconnect,
            name: 'WalletConnect',
            iconName: 'walletConnectIcon.svg',
            description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
            href: null,
            color: '#4196FC',
            mobile: true
          },
          WALLET_LINK: {
            connector: walletlink,
            name: 'Coinbase Wallet',
            iconName: 'coinbaseWalletIcon.svg',
            description: 'Use Coinbase Wallet app on mobile device',
            href: null,
            color: '#315CF5'
          },
          COINBASE_LINK: {
            name: 'Open in Coinbase Wallet',
            iconName: 'coinbaseWalletIcon.svg',
            description: 'Open in Coinbase Wallet app.',
            href: 'https://go.cb-w.com/mtUDhEZPy1',
            color: '#315CF5',
            mobile: true,
            mobileOnly: true
          }
        }
      }

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

// the Uniswap Default token list lives here
export const DEFAULT_TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/omelette-swap/assets/master/blockchains/omchain/tokenlist.json'
