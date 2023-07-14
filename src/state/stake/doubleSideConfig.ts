import { ChainId, WOMC } from '@uniswap/sdk'
import { DoubleSideStaking } from './hooks'
import { MINICHEF_ADDRESS } from '../../constants'
import * as TOKENS from '../../constants'

export const DOUBLE_SIDE_STAKING: { [key: string]: DoubleSideStaking } = {
  CKN_OMLT_V2: {
    tokens: [TOKENS.CKN[ChainId.OMCHAIN], TOKENS.OMLT[ChainId.OMCHAIN]],
    stakingRewardAddress: MINICHEF_ADDRESS[ChainId.OMCHAIN],
    version: 2
  },
  EGG_OMLT_V2: {
    tokens: [TOKENS.EGG[ChainId.OMCHAIN], TOKENS.OMLT[ChainId.OMCHAIN]],
    stakingRewardAddress: MINICHEF_ADDRESS[ChainId.OMCHAIN],
    version: 2
  },
  DCK_OMLT_V2: {
    tokens: [TOKENS.DCK[ChainId.OMCHAIN], TOKENS.OMLT[ChainId.OMCHAIN]],
    stakingRewardAddress: MINICHEF_ADDRESS[ChainId.OMCHAIN],
    version: 2
  },
  RST_OMLT_V2: {
    tokens: [TOKENS.RST[ChainId.OMCHAIN], TOKENS.OMLT[ChainId.OMCHAIN]],
    stakingRewardAddress: MINICHEF_ADDRESS[ChainId.OMCHAIN],
    version: 2
  }
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
