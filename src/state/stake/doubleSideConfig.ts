import { ChainId, WOMC } from '@uniswap/sdk'
import { DoubleSideStaking } from './hooks'
import { MINICHEF_ADDRESS } from '../../constants'
import * as TOKENS from '../../constants'

export const DOUBLE_SIDE_STAKING: { [key: string]: DoubleSideStaking } = {
}

export const DOUBLE_SIDE_STAKING_V0: DoubleSideStaking[] = Object.values(DOUBLE_SIDE_STAKING).filter(
  staking => staking.version === 0
)
export const DOUBLE_SIDE_STAKING_V1: DoubleSideStaking[] = Object.values(DOUBLE_SIDE_STAKING).filter(
  staking => staking.version === 1
)
export const DOUBLE_SIDE_STAKING_V2: DoubleSideStaking[] = Object.values(DOUBLE_SIDE_STAKING).filter(
  staking => staking.version === 2
)

export const DOUBLE_SIDE_STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: DoubleSideStaking[][]
} = {
  [ChainId.OMCHAIN]: [DOUBLE_SIDE_STAKING_V0, DOUBLE_SIDE_STAKING_V1, DOUBLE_SIDE_STAKING_V2]
}
