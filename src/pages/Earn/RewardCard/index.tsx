/* eslint-disable react/prop-types */
import React from 'react'
import { AutoColumn } from '../../../components/Column'
import styled from 'styled-components'
import { JSBI, Currency, TokenAmount } from '@uniswap/sdk'
import { TYPE } from '../../../theme'
import { RowBetween } from '../../../components/Row'
import { DataCard, CardNoise, CardBGImageSmaller } from '../../../components/earn/styled'
import { ButtonPrimary } from '../../../components/Button'
import CountUp from 'react-countup'
import usePrevious from '../../../hooks/usePrevious'
import { BIG_INT_ZERO } from '../../../constants'

const StyledBottomCard = styled(DataCard)<{ dim: any; isOverlay: boolean }>`
  background: ${({ theme }) => theme.bg3};
  opacity: ${({ dim }) => (dim ? 0.4 : 1)};
  margin-top: ${({ isOverlay }) => (isOverlay ? '-40px' : '-24px')};
  padding: 0 1.25rem 1rem 1.25rem;
  padding-top: 32px;
  z-index: 1;
`

export interface ManageProps {
  stakedAmount: TokenAmount
  earnedAmount: TokenAmount
  weeklyRewardRate?: TokenAmount
  currency?: Currency | null
  setShowClaimRewardModal: () => void
  isOverlay: boolean
  isSuperFarm?: boolean
}

const RewardCard: React.FC<ManageProps> = ({
  stakedAmount,
  earnedAmount,
  weeklyRewardRate,
  currency,
  setShowClaimRewardModal,
  isOverlay,
  isSuperFarm = true
}) => {
  const countUpAmount = earnedAmount?.toFixed(6) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  return (
    <StyledBottomCard dim={stakedAmount?.equalTo(BIG_INT_ZERO)} isOverlay={isOverlay}>
      <CardBGImageSmaller desaturate />
      <CardNoise />
      <AutoColumn gap="sm">
        <RowBetween>
          <div>
            <TYPE.main>{'Your unclaimed ' + (currency ? currency?.symbol : 'OMLT')}</TYPE.main>
          </div>
          {!isSuperFarm && earnedAmount && JSBI.notEqual(BIG_INT_ZERO, earnedAmount?.raw) && (
            <ButtonPrimary
              padding="8px"
              borderRadius="8px"
              width="fit-content"
              onClick={() => {
                setShowClaimRewardModal()
              }}
            >
              {'Claim'}
            </ButtonPrimary>
          )}
        </RowBetween>
        <RowBetween style={{ alignItems: 'baseline' }}>
          <TYPE.largeHeader fontSize={36} fontWeight={600}>
            <CountUp
              key={countUpAmount}
              decimalPlaces={4}
              start={parseFloat(countUpAmountPrevious)}
              end={parseFloat(countUpAmount)}
              duration={1}
            />
          </TYPE.largeHeader>
          <TYPE.main fontSize={16} fontWeight={500}>
            <span role="img" aria-label="wizard-icon" style={{ marginRight: '8px ' }}>
              ⚡
            </span>
            {weeklyRewardRate?.toSignificant(4, { groupSeparator: ',' }) ?? '-'}
            {' ' + (currency ? currency?.symbol : 'OMLT') + ' / week'}
          </TYPE.main>
        </RowBetween>
      </AutoColumn>
    </StyledBottomCard>
  )
}

export default RewardCard
