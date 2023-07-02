import React from 'react'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import styled from 'styled-components'
import { TYPE, StyledInternalLink } from '../../theme'
import DoubleCurrencyLogo from '../DoubleLogo'
import { WOMC, Token } from '@uniswap/sdk'
import { ButtonPrimary } from '../Button'
import { DoubleSideStakingInfo, useMinichefPools } from '../../state/stake/hooks'
//import { useColor } from '../../hooks/useColor'
import { currencyId } from '../../utils/currencyId'
import { Break, CardNoise, CardBGImage } from './styled'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useTranslation } from 'react-i18next'
import RewardTokens from '../RewardTokens'
//import { Box } from '@pangolindex/components'
import { useTokens } from '../../hooks/Tokens'
import { ChainId } from '@uniswap/sdk'

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg1};
  width: 100%;
  height: 100%;
  margin-top: 1rem;
`

const StatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

const AprContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  margin-left: 1rem;
`

const Wrapper = styled(AutoColumn)<{ showBackground: boolean; bgColor: any }>`
  border-radius: 12px;
  width: 100%;
  overflow: hidden;
  position: relative;
  background: linear-gradient(0deg, rgba(161, 99, 35, 1) 0%, rgba(253, 187, 45, 1) 100%);
  color: ${({ theme }) => theme.text2} !important;
`

const TopSection = styled.div<{ isStaking?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // grid-template-columns: ${({ isStaking }) => (isStaking ? '48px 1fr auto 120px 120px' : '48px 1fr auto 120px')};
  // grid-gap: 0px;
  align-items: center;
  padding: 1rem;
  z-index: 1;
  /* // ${({ theme, isStaking }) => theme.mediaWidth.upToSmall`
  //    grid-template-columns: ${isStaking ? '48px 1fr auto 96px 96px' : ' 48px 1fr auto 96px'};
  //  `}; */
`

const BottomSection = styled.div<{ showBackground: boolean }>`
  padding: 12px 16px;
  opacity: ${({ showBackground }) => (showBackground ? '1' : '0.4')};
  border-radius: 0 0 12px 12px;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  z-index: 1;
`

export default function DoubleSidePoolCard({
  stakingInfo,
  version,
  swapFeeApr,
  stakingApr
}: {
  stakingInfo: DoubleSideStakingInfo
  version: string
  swapFeeApr: number
  stakingApr: number
}) {
  const chainId = ChainId.OMCHAIN

  const token0 = stakingInfo.tokens[0]
  const token1 = stakingInfo.tokens[1]

  const currency0 = unwrappedToken(token0)
  const currency1 = unwrappedToken(token1)

  const poolMap = useMinichefPools()

  const { t } = useTranslation()
  const isStaking = Boolean(stakingInfo.stakedAmount.greaterThan('0'))

  const token: Token =
    currency0 === WOMC[chainId] || currency1 === WOMC[chainId]
      ? currency0 === WOMC[chainId]
        ? token1
        : token0
      : token0

  const totalStakedInUsd = stakingInfo.totalStakedInUsd?.toSignificant(4, { groupSeparator: ',' })

  const backgroundColor = '#f9ba53'

  const rewardTokens = useTokens(stakingInfo?.rewardTokensAddress)

  return (
    <Wrapper showBackground={isStaking} bgColor={backgroundColor}>
      <CardNoise />

      <TopSection isStaking={isStaking}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} />
          <TYPE.black fontWeight={600} fontSize={24} style={{ marginLeft: '18px' }}>
            {currency0.symbol}-{currency1.symbol}
          </TYPE.black>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {(isStaking || !stakingInfo.isPeriodFinished) && (
            <StyledInternalLink
              to={`/png/${currencyId(currency0)}/${currencyId(currency1)}/${version}`}
              style={{ width: '100%' }}
            >
              <ButtonPrimary padding="12px" borderRadius="8px">
                {isStaking ? 'Manage' : 'Deposit'}
              </ButtonPrimary>
            </StyledInternalLink>
          )}
        </div>
      </TopSection>

      <StatContainer>
        <RowBetween>
          <TYPE.black> {'Total Staked'}</TYPE.black>
          <TYPE.black>{totalStakedInUsd ? `$${totalStakedInUsd}` : '-'}</TYPE.black>
        </RowBetween>
      </StatContainer>
      <AprContainer>
        <RowBetween>
          <TYPE.black>Swap Fee APR</TYPE.black>
          <TYPE.black>{swapFeeApr && !stakingInfo.isPeriodFinished ? `${swapFeeApr}%` : '-'}</TYPE.black>
        </RowBetween>
        <RowBetween>
          <TYPE.black>{(rewardTokens || [])?.length === 0 ? 'Farming APR' : 'Super Farm APR'}</TYPE.black>
          <TYPE.black>{stakingApr && !stakingInfo.isPeriodFinished ? `${stakingApr}%` : '-'}</TYPE.black>
        </RowBetween>
        <RowBetween>
          <TYPE.black>Total APR</TYPE.black>
          <TYPE.black>{swapFeeApr && !stakingInfo.isPeriodFinished ? `${swapFeeApr + stakingApr}%` : '-'}</TYPE.black>
        </RowBetween>
      </AprContainer>

      {isStaking && (
        <>
          <Break />
          <Box>
            <BottomSection showBackground={true}>
              <TYPE.black color={'black'} fontWeight={500}>
                <span>{'Your Rate'}</span>
              </TYPE.black>

              <TYPE.black style={{ textAlign: 'right' }} color={'black'} fontWeight={500}>
                <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                  ⚡
                </span>
                {`${stakingInfo.rewardRatePerWeek?.toSignificant(4, { groupSeparator: ',' })} OMLT / week`}
              </TYPE.black>
            </BottomSection>

            {(stakingInfo?.rewardTokensAddress || []).length > 0 && (rewardTokens || []).length > 0 && (
              <BottomSection showBackground={true}>
                <TYPE.black color={'black'} fontWeight={500}>
                  <span>{'Extra Reward'}</span>
                </TYPE.black>

                <AutoColumn gap="sm">
                  {(rewardTokens || []).map((token, index) => {
                    const tokenMultiplier = stakingInfo?.rewardTokensMultiplier?.[index]
                    const weeklyExtraRewardRate =
                      stakingInfo?.getExtraTokensWeeklyRewardRate &&
                      stakingInfo?.getExtraTokensWeeklyRewardRate(
                        stakingInfo?.rewardRatePerWeek,
                        token as Token,
                        tokenMultiplier
                      )

                    return (
                      <TYPE.black style={{ textAlign: 'right' }} color={'black'} fontWeight={500} key={index}>
                        <span role="img" aria-label="wizard-icon" style={{ marginRight: '0.5rem' }}>
                          ⚡
                        </span>
                        {`${weeklyExtraRewardRate?.toSignificant(4, { groupSeparator: ',' })} ${token?.symbol} / week`}
                      </TYPE.black>
                    )
                  })}
                </AutoColumn>
              </BottomSection>
            )}
          </Box>
        </>
      )}
    </Wrapper>
  )
}
