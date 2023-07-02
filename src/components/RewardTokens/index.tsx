/* eslint-disable @typescript-eslint/no-unused-vars */
import { Token, Currency } from '@uniswap/sdk'
import React from 'react'
import { LogoSize } from '../../constants'
import styled from 'styled-components'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-right: ${({ sizeraw, margin }) => margin && (sizeraw / 3 + 8).toString() + 'px'};
`

interface RewardTokensLogoProps {
  margin?: boolean
  size?: LogoSize
  rewardTokens?: Array<Token | null | undefined> | null
}

const CurrencyLogo = ({
  currency,
  size,
  style,
  imageSize
}: {
  currency?: Currency
  size?: LogoSize
  style?: React.CSSProperties
  imageSize?: LogoSize
}): JSX.Element => {
  // Your CurrencyLogo component implementation
  // ...

  // Example: Returning a JSX element
  return <div>{/* JSX content */}</div>
}

const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => `-${(sizeraw / 2).toString()}px`} !important;
`

export default function RewardTokens({ rewardTokens = [], size = 24, margin = false }: RewardTokensLogoProps) {
  const tokens = rewardTokens || []

  return (
    <Wrapper sizeraw={size} margin={margin}>
      {(tokens || []).map((token, i) => {
        return <CoveredLogo key={i} currency={token as Token} size={size} sizeraw={size} imageSize={48} />
      })}
    </Wrapper>
  )
}
