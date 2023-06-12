import { Currency, OMC, Token } from '@uniswap/sdk'

export function currencyId(currency: Currency): string {
  if (currency === OMC) return 'OMC'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
