import { ChainId, JSBI, Percent, Token, WOMC } from '@uniswap/sdk'

import { injected, walletconnect, walletlink } from '../connectors'

export const ROUTER_ADDRESS = '0x733c1986e736496fcaeEE895017eF3B5d7610461'

export const MINICHEF_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.OMCHAIN]: '0x6baB4aA367931a47e3Ed5A0562Bf8B47430D383F'
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const USDT = new Token(ChainId.OMCHAIN, '0xeBFe8e1D0929578855DEb4718f0d89eFF7F0bD90', 18, 'USDT', 'Tether USD')

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const USDCe: { [chainId in ChainId]: Token } = {
  [ChainId.OMCHAIN]: new Token(ChainId.OMCHAIN, ZERO_ADDRESS, 6, 'USDC.e', 'USD Coin')
}

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.OMCHAIN]: new Token(ChainId.OMCHAIN, ZERO_ADDRESS, 6, 'USDC', 'USD Coin')
}

export const OMLT: { [chainId in ChainId]: Token } = {
  [ChainId.OMCHAIN]: new Token(ChainId.OMCHAIN, '0x0d039A75b39624511B2fad30A709B78E9E72FE74', 18, 'OMLT', 'Omelette')
}

export const TT: { [chainId in ChainId]: Token } = {
  [ChainId.OMCHAIN]: new Token(ChainId.OMCHAIN, '0x6BEB3a2B9B54178E7EA3D9edb893Bec92f50B4E5', 18, 'TT', 'TT Token')
}

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_ONE = JSBI.BigInt(1)
export const BIG_INT_TWO = JSBI.BigInt(2)
export const BIG_INT_TEN = JSBI.BigInt(10)
export const BIG_INT_EIGHTEEN = JSBI.BigInt(18)
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)
export const ONE_TOKEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

export const OMELETTESWAP_API_BASE_URL = `https://api.omeletteswap.com`

export const OMELETTESWAP_TOKENS_REPO_RAW_BASE_URL = `https://raw.githubusercontent.com/omeletteswap/tokens`

export type LogoSize = 24 | 48
export const getTokenLogoURL = (address: string, size: LogoSize = 24) =>
  `${OMELETTESWAP_TOKENS_REPO_RAW_BASE_URL}/main/assets/${address}/logo_${size}.png`

const WOMC_ONLY: ChainTokenList = {
  [ChainId.OMCHAIN]: [WOMC[ChainId.OMCHAIN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WOMC_ONLY,
  [ChainId.OMCHAIN]: [...WOMC_ONLY[ChainId.OMCHAIN], USDT]
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WOMC_ONLY,
  [ChainId.OMCHAIN]: [...WOMC_ONLY[ChainId.OMCHAIN], USDT]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WOMC_ONLY,
  [ChainId.OMCHAIN]: [...WOMC_ONLY[ChainId.OMCHAIN], USDT]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.OMCHAIN]: [
    [USDT, WOMC[ChainId.OMCHAIN]]
    /*     [USDC, USDT],
    [DAI, USDT] */
  ]
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
  'https://unpkg.com/@uniswap/default-token-list@latest/uniswap-default.tokenlist.json'
