import { Token, TokenAmount, JSBI, Pair, WOMC, CurrencyAmount } from '@uniswap/sdk'
import { ChainId } from '@uniswap/sdk'
import { useStakingContract } from '../../hooks/useContract'
import {
  MINICHEF_ADDRESS,
  USDC,
  USDCe,
  OMLT,
  BIG_INT_SECONDS_IN_WEEK,
  BIG_INT_ZERO,
  BIG_INT_TWO
} from '../../constants'
import { useSingleCallResult, useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'
import { useMemo } from 'react'
import { useActiveWeb3React } from '../../hooks'
import { PairState, usePair, usePairs } from '../../data/Reserves'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from './doubleSideConfig'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { REWARDER_VIA_MULTIPLIER_INTERFACE } from '../../constants/abis/rewarderViaMultiplier'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { useTranslation } from 'react-i18next'
import { tryParseAmount } from '../swap/hooks'

export interface StakingInfoBase {
  // the address of the reward contract
  stakingRewardAddress: string
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRatePerSecond: TokenAmount
  totalRewardRatePerWeek: TokenAmount
  // the current amount of token distributed to the active account per week.
  // equivalent to percent of total supply * reward rate * (60 * 60 * 24 * 7)
  rewardRatePerWeek: TokenAmount
  // when the period ends
  periodFinish: Date | undefined
  // has the reward period expired
  isPeriodFinished: boolean
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalWeeklyRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRatePerSecond: TokenAmount
  ) => TokenAmount
}

export interface DoubleSideStakingInfo extends StakingInfoBase {
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the pool weight
  multiplier: JSBI
  // total staked AVAX in the pool
  totalStakedInWavax: TokenAmount
  totalStakedInUsd: TokenAmount
  rewardTokensAddress?: Array<string>
  rewardsAddress?: string
  rewardTokensMultiplier?: Array<JSBI>
  getExtraTokensWeeklyRewardRate?: (
    rewardRatePerWeek: TokenAmount,
    token: Token,
    tokenMultiplier: JSBI | undefined
  ) => TokenAmount
}

export interface DoubleSideStaking {
  tokens: [Token, Token]
  stakingRewardAddress: string
  version: number
  multiplier?: number
}

export interface MinichefToken {
  id: string
  symbol: string
  derivedUSD: number
  name: string
  decimals: number
}

export interface MinichefPair {
  id: string
  reserve0: number
  reserve1: number
  totalSupply: number
  token0: MinichefToken
  token1: MinichefToken
}

export interface MinichefFarmReward {
  id: string
  token: MinichefToken
  multiplier: number
}

export interface MinichefFarmRewarder {
  id: string
  rewards: Array<MinichefFarmReward>
}

export interface FarmingPositions {
  id: string
  stakedTokenBalance: number
}

export interface MinichefFarm {
  id: string
  pid: string
  tvl: number
  allocPoint: number
  rewarderAddress: string
  chefAddress: string
  pairAddress: string
  rewarder: MinichefFarmRewarder
  pair: MinichefPair
  farmingPositions: FarmingPositions[]
  earnedAmount?: number
  swapFeeApr?: number
  stakingApr?: number
  combinedApr?: number
}

export interface MinichefV2 {
  id: string
  totalAllocPoint: number
  rewardPerSecond: number
  rewardsExpiration: number
  farms: Array<MinichefFarm>
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}

export const useMinichefPools = (): { [key: string]: number } => {
  const chainId = ChainId.OMCHAIN
  const minichefContract = useStakingContract(MINICHEF_ADDRESS[chainId])
  const lpTokens = useSingleCallResult(minichefContract, 'lpTokens', []).result
  const lpTokensArr = lpTokens?.[0]

  return useMemo(() => {
    const poolMap: { [key: string]: number } = {}
    if (lpTokensArr) {
      lpTokensArr.forEach((address: string, index: number) => {
        poolMap[address] = index
      })
    }
    return poolMap
  }, [lpTokensArr])
}

export const tokenComparator = (
  { address: addressA }: { address: string },
  { address: addressB }: { address: string }
) => {
  // Sort AVAX last
  if (addressA === WOMC[ChainId.OMCHAIN].address) return 1
  else if (addressB === WOMC[ChainId.OMCHAIN].address) return -1
  // Sort USDC first
  else if (addressA === USDC[ChainId.OMCHAIN].address) return -1
  else if (addressB === USDC[ChainId.OMCHAIN].address) return 1
  // Sort USDCe first
  else if (addressA === USDCe[ChainId.OMCHAIN].address) return -1
  else if (addressB === USDCe[ChainId.OMCHAIN].address) return 1
  else return 0
}

const calculateTotalStakedAmountInOmc = function(
  amountStaked: JSBI,
  amountAvailable: JSBI,
  reserveInWavax: JSBI,
  chainId: ChainId
): TokenAmount {
  if (JSBI.GT(amountAvailable, 0)) {
    // take the total amount of LP tokens staked, multiply by AVAX value of all LP tokens, divide by all LP tokens
    return new TokenAmount(
      WOMC[chainId],
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(amountStaked, reserveInWavax),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
        ),
        amountAvailable
      )
    )
  } else {
    return new TokenAmount(WOMC[chainId], JSBI.BigInt(0))
  }
}

const calculateTotalStakedAmountInOmcFromOmlt = function(
  amountStaked: JSBI,
  amountAvailable: JSBI,
  omcOmltPairReserveOfOmlt: JSBI,
  omcOmltPairReserveOfWomc: JSBI,
  reserveInOmlt: JSBI,
  chainId: ChainId
): TokenAmount {
  if (JSBI.EQ(amountAvailable, JSBI.BigInt(0))) {
    return new TokenAmount(WOMC[chainId], JSBI.BigInt(0))
  }

  const oneToken = JSBI.BigInt(1000000000000000000)
  const omcOmltRatio = JSBI.divide(JSBI.multiply(oneToken, omcOmltPairReserveOfWomc), omcOmltPairReserveOfOmlt)
  const valueOfOmltInOmc = JSBI.divide(JSBI.multiply(reserveInOmlt, omcOmltRatio), oneToken)

  return new TokenAmount(
    WOMC[chainId],
    JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(amountStaked, valueOfOmltInOmc),
        JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the wavax they entitle owner to
      ),
      amountAvailable
    )
  )
}

export const getExtraTokensWeeklyRewardRate = (
  rewardRatePerWeek: TokenAmount,
  token: Token,
  tokenMultiplier: JSBI | undefined
) => {
  const TEN_EIGHTEEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18))

  const rewardMultiplier = JSBI.BigInt(tokenMultiplier || 1)

  const unadjustedRewardPerWeek = JSBI.multiply(rewardMultiplier, rewardRatePerWeek?.raw)

  const finalReward = JSBI.divide(unadjustedRewardPerWeek, TEN_EIGHTEEN)

  return new TokenAmount(token, finalReward)
}

export const useMinichefStakingInfos = (version = 2, pairToFilterBy?: Pair | null): DoubleSideStakingInfo[] => {
  const { account } = useActiveWeb3React()
  const chainId = ChainId.OMCHAIN

  const minichefContract = useStakingContract(MINICHEF_ADDRESS[chainId])
  const poolMap = useMinichefPools()
  //const png = PNG[chainId]

  const info = useMemo(
    () =>
      chainId
        ? DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.[version]?.filter(item =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(item.tokens[0]) && pairToFilterBy.involvesToken(item.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy, version]
  )

  const _tokens = useMemo(() => info.map(({ tokens }) => tokens), [info])
  const pairs = usePairs(_tokens)

  // @dev: If no farms load, you likely loaded an incorrect config from doubleSideConfig.js
  // Enable this and look for an invalid pair

  const pairAddresses = useMemo(() => {
    return pairs.map(([, pair]) => pair?.liquidityToken.address)
  }, [pairs])

  const pairTotalSupplies = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'totalSupply')
  const balances = useMultipleContractSingleData(pairAddresses, ERC20_INTERFACE, 'balanceOf', [
    MINICHEF_ADDRESS[chainId]
  ])

  const [omcOmltPairState, omcOmltPair] = usePair(WOMC[chainId], OMLT[chainId])

  const poolIdArray = useMemo(() => {
    if (!pairAddresses || !poolMap) return []
    // TODO: clean up this logic. seems like a lot of work to ensure correct types
    const NOT_FOUND = -1
    const results = pairAddresses.map(address => poolMap[address ?? ''] ?? NOT_FOUND)
    if (results.some(result => result === NOT_FOUND)) return []
    return results
  }, [poolMap, pairAddresses])

  const poolsIdInput = useMemo(() => {
    if (!poolIdArray) return []
    return poolIdArray.map(pid => [pid])
  }, [poolIdArray])

  const poolInfos = useSingleContractMultipleData(minichefContract, 'poolInfo', poolsIdInput ?? [])

  const rewarders = useSingleContractMultipleData(minichefContract, 'rewarder', poolsIdInput ?? [])

  const userInfoInput = useMemo(() => {
    if (!poolIdArray || !account) return []
    return poolIdArray.map(pid => [pid, account])
  }, [poolIdArray, account])

  const userInfos = useSingleContractMultipleData(minichefContract, 'userInfo', userInfoInput ?? [])

  const pendingRewards = useSingleContractMultipleData(minichefContract, 'pendingReward', userInfoInput ?? [])

  const rewardsAddresses = useMemo(() => {
    if ((rewarders || []).length === 0) return []
    if (rewarders.some(item => item.loading)) return []
    return rewarders.map(reward => reward?.result?.[0])
  }, [rewarders])

  const rewardTokensAddresses = useMultipleContractSingleData(
    rewardsAddresses,
    REWARDER_VIA_MULTIPLIER_INTERFACE,
    'getRewardTokens',
    []
  )

  const rewardTokensMultipliers = useMultipleContractSingleData(
    rewardsAddresses,
    REWARDER_VIA_MULTIPLIER_INTERFACE,
    'getRewardMultipliers',
    []
  )

  const rewardPerSecond = useSingleCallResult(minichefContract, 'rewardPerSecond', []).result
  const totalAllocPoint = useSingleCallResult(minichefContract, 'totalAllocPoint', []).result
  const rewardsExpiration = useSingleCallResult(minichefContract, 'rewardsExpiration', []).result
  const usdPriceTmp = useUSDCPrice(WOMC[chainId])
  const usdPrice = usdPriceTmp

  const arr = useMemo(() => {
    if (!chainId) return []

    return pairAddresses.reduce<any[]>((memo: any, _pairAddress: any, index: any) => {
      const pairTotalSupplyState = pairTotalSupplies[index]
      const balanceState = balances[index]
      const poolInfo = poolInfos[index]
      const userPoolInfo = userInfos[index]
      const [pairState, pair] = pairs[index]
      const pendingRewardInfo = pendingRewards[index]
      const rewardTokensAddress = rewardTokensAddresses[index]
      const rewardTokensMultiplier = rewardTokensMultipliers[index]
      const rewardsAddress = rewardsAddresses[index]
      if (
        pairTotalSupplyState?.loading === false &&
        poolInfo?.loading === false &&
        balanceState?.loading === false &&
        pair &&
        omcOmltPair &&
        pairState !== PairState.LOADING &&
        omcOmltPairState !== PairState.LOADING &&
        rewardPerSecond &&
        totalAllocPoint &&
        rewardsExpiration?.[0] &&
        rewardTokensAddress?.loading === false
      ) {
        if (
          balanceState?.error ||
          pairTotalSupplyState.error ||
          pairState === PairState.INVALID ||
          pairState === PairState.NOT_EXISTS ||
          omcOmltPairState === PairState.INVALID ||
          omcOmltPairState === PairState.NOT_EXISTS
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const token0 = pair?.token0
        const token1 = pair?.token1

        const tokens = [token0, token1].sort(tokenComparator)

        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))
        const lpToken = dummyPair.liquidityToken

        const poolAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(poolInfo?.result?.['allocPoint']))
        const totalAllocPointAmount = new TokenAmount(lpToken, JSBI.BigInt(totalAllocPoint?.[0]))
        const rewardRatePerSecAmount = new TokenAmount(OMLT[chainId], JSBI.BigInt(rewardPerSecond?.[0]))
        const poolRewardRate = new TokenAmount(
          OMLT[chainId],
          JSBI.divide(JSBI.multiply(poolAllocPointAmount.raw, rewardRatePerSecAmount.raw), totalAllocPointAmount.raw)
        )

        const totalRewardRatePerWeek = new TokenAmount(
          OMLT[chainId],
          JSBI.multiply(poolRewardRate.raw, BIG_INT_SECONDS_IN_WEEK)
        )

        const periodFinishMs = rewardsExpiration?.[0]?.mul(1000)?.toNumber()
        // periodFinish will be 0 immediately after a reward contract is initialized
        const isPeriodFinished =
          periodFinishMs === 0 ? false : periodFinishMs < Date.now() || poolAllocPointAmount.equalTo('0')

        const totalSupplyStaked = JSBI.BigInt(balanceState?.result?.[0])
        const totalSupplyAvailable = JSBI.BigInt(pairTotalSupplyState?.result?.[0])
        const totalStakedAmount = new TokenAmount(lpToken, JSBI.BigInt(balanceState?.result?.[0]))
        const stakedAmount = new TokenAmount(lpToken, JSBI.BigInt(userPoolInfo?.result?.['amount'] ?? 0))
        const earnedAmount = new TokenAmount(OMLT[chainId], JSBI.BigInt(pendingRewardInfo?.result?.['pending'] ?? 0))
        const multiplier = JSBI.BigInt(poolInfo?.result?.['allocPoint'])

        const isOmcPool = pair.involvesToken(WOMC[chainId])
        const isOmltPool = pair.involvesToken(OMLT[chainId])

        let totalStakedInUsd
        const totalStakedInWavax = new TokenAmount(WOMC[chainId], BIG_INT_ZERO)

        if (JSBI.equal(totalSupplyAvailable, BIG_INT_ZERO)) {
          // Default to 0 values above avoiding division by zero errors
        } else if (pair.involvesToken(USDCe[chainId])) {
          const pairValueInUSDC = JSBI.multiply(pair.reserveOf(USDCe[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUSDC = JSBI.divide(JSBI.multiply(pairValueInUSDC, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = new TokenAmount(USDCe[chainId], stakedValueInUSDC) || undefined
        } else if (pair.involvesToken(USDC[chainId])) {
          const pairValueInUSDC = JSBI.multiply(pair.reserveOf(USDC[chainId]).raw, BIG_INT_TWO)
          const stakedValueInUSDC = JSBI.divide(JSBI.multiply(pairValueInUSDC, totalSupplyStaked), totalSupplyAvailable)
          totalStakedInUsd = new TokenAmount(USDC[chainId], stakedValueInUSDC) || undefined
        } else if (isOmcPool) {
          const _totalStakedInWomc = calculateTotalStakedAmountInOmc(
            totalSupplyStaked,
            totalSupplyAvailable,
            pair.reserveOf(WOMC[chainId]).raw,
            chainId
          )

          totalStakedInUsd = (_totalStakedInWomc && (usdPrice?.quote(_totalStakedInWomc) as TokenAmount)) || undefined
        } else if (isOmltPool) {
          const _totalStakedInWomc = calculateTotalStakedAmountInOmcFromOmlt(
            totalSupplyStaked,
            totalSupplyAvailable,
            omcOmltPair.reserveOf(OMLT[chainId]).raw,
            omcOmltPair.reserveOf(WOMC[chainId]).raw,
            pair.reserveOf(OMLT[chainId]).raw,
            chainId
          )
          totalStakedInUsd = (_totalStakedInWomc && (usdPrice?.quote(_totalStakedInWomc) as TokenAmount)) || undefined
        } else {
          // Contains no stablecoin, WAVAX, nor PNG
          console.error(`Could not identify total staked value for pair ${pair.liquidityToken.address}`)
        }

        const getHypotheticalWeeklyRewardRate = (
          _stakedAmount: TokenAmount,
          _totalStakedAmount: TokenAmount,
          _totalRewardRatePerSecond: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            OMLT[chainId],
            JSBI.greaterThan(_totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(
                  JSBI.multiply(
                    JSBI.multiply(_totalRewardRatePerSecond.raw, _stakedAmount.raw),
                    BIG_INT_SECONDS_IN_WEEK
                  ),
                  _totalStakedAmount.raw
                )
              : JSBI.BigInt(0)
          )
        }

        const userRewardRatePerWeek = getHypotheticalWeeklyRewardRate(stakedAmount, totalStakedAmount, poolRewardRate)

        memo.push({
          stakingRewardAddress: MINICHEF_ADDRESS[chainId],
          tokens,
          earnedAmount,
          rewardRatePerWeek: userRewardRatePerWeek,
          totalRewardRatePerSecond: poolRewardRate,
          totalRewardRatePerWeek: totalRewardRatePerWeek,
          stakedAmount,
          totalStakedAmount,
          totalStakedInWavax,
          totalStakedInUsd,
          multiplier: JSBI.divide(multiplier, JSBI.BigInt(100)),
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          isPeriodFinished,
          getHypotheticalWeeklyRewardRate,
          getExtraTokensWeeklyRewardRate,
          rewardTokensAddress: rewardTokensAddress?.result?.[0],
          rewardTokensMultiplier: rewardTokensMultiplier?.result?.[0],
          rewardsAddress
        })
      }

      return memo
    }, [])
  }, [
    chainId,
    pairTotalSupplies,
    poolInfos,
    userInfos,
    pairs,
    rewardPerSecond,
    totalAllocPoint,
    omcOmltPair,
    omcOmltPairState,
    pendingRewards,
    rewardsExpiration,
    balances,
    usdPrice,
    pairAddresses,
    rewardTokensAddresses,
    rewardsAddresses,
    rewardTokensMultipliers
  ])

  return arr
}
