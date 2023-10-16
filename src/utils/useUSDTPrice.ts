// TODO: Actually calculate price

import { ChainId, Currency, currencyEquals, JSBI, Price, WOMC } from '@uniswap/sdk'
import { useMemo } from 'react'
import { USDT as USDTb } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { wrappedCurrency } from './wrappedCurrency'

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useUSDCPrice(currency?: Currency): Price | undefined {
  const chainId = ChainId.OMCHAIN
  const wrapped = wrappedCurrency(currency, chainId)
  const USDC = USDTb[chainId]
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals(WOMC[chainId], wrapped) ? undefined : currency,
        chainId ? WOMC[chainId] : undefined
      ],
      [wrapped?.equals(USDC) ? undefined : wrapped, chainId === ChainId.OMCHAIN ? USDC : undefined],
      [chainId ? WOMC[chainId] : undefined, chainId === ChainId.OMCHAIN ? USDC : undefined]
    ],
    [chainId, currency, wrapped, USDC]
  )
  const [[avaxPairState, avaxPair], [usdcPairState, usdcPair], [usdcAvaxPairState, usdcAvaxPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle WOMC/avax
    if (wrapped.equals(WOMC[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf(WOMC[chainId])
        return new Price(currency, USDC, price.denominator, price.numerator)
      } else {
        return undefined
      }
    }
    // handle usdc
    if (wrapped.equals(USDC)) {
      return new Price(USDC, USDC, '1', '1')
    }

    const avaxPairAVAXAmount = avaxPair?.reserveOf(WOMC[chainId])
    const avaxPairAVAXUSDCValue: JSBI =
      avaxPairAVAXAmount && usdcAvaxPair
        ? usdcAvaxPair.priceOf(WOMC[chainId]).quote(avaxPairAVAXAmount).raw
        : JSBI.BigInt(0)

    // all other tokens
    // first try the usdc pair
    if (usdcPairState === PairState.EXISTS && usdcPair && usdcPair.reserveOf(USDC).greaterThan(avaxPairAVAXUSDCValue)) {
      const price = usdcPair.priceOf(wrapped)
      return new Price(currency, USDC, price.denominator, price.numerator)
    }
    if (avaxPairState === PairState.EXISTS && avaxPair && usdcAvaxPairState === PairState.EXISTS && usdcAvaxPair) {
      if (usdcAvaxPair.reserveOf(USDC).greaterThan('0') && avaxPair.reserveOf(WOMC[chainId]).greaterThan('0')) {
        const avaxUsdcPrice = usdcAvaxPair.priceOf(USDC)
        const currencyAvaxPrice = avaxPair.priceOf(WOMC[chainId])
        const usdcPrice = avaxUsdcPrice.multiply(currencyAvaxPrice).invert()
        return new Price(currency, USDC, usdcPrice.denominator, usdcPrice.numerator)
      }
    }
    return undefined
  }, [
    chainId,
    currency,
    avaxPair,
    avaxPairState,
    usdcAvaxPair,
    usdcAvaxPairState,
    usdcPair,
    usdcPairState,
    wrapped,
    USDC
  ])
}
