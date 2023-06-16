/* eslint-disable react/jsx-no-undef */
import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'

import styled from 'styled-components'

import OmeletteLogoDark from '../../assets/images/omelette_logo.png'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'
import { NavLink } from 'react-router-dom'

import Row, { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
//import VersionSwitch from './VersionSwitch'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1.2rem;
  width: fit-content;
  margin: 0 18px;
  font-weight: 600;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

/* const TitleText = styled(Row)`
  width: fit-content;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
` */

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  margin: 0 1rem 0 0;
  :hover {
    transform: rotate(-5deg);
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.OMCHAIN]: 'Omchain'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()

  const userEthBalance = useETHBalances([account])[account]
  const [isDark] = useDarkModeManager()

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href=".">
            <UniIcon>
              <img width={50} height={50} src={isDark ? OmeletteLogoDark : OmeletteLogoDark} alt="logo" />
            </UniIcon>
          </Title>
          <HeaderLinks>
            <StyledNavLink id={`swap-nav-link`} to={'/ido'}>
              IDO
            </StyledNavLink>
            <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
              Swap
            </StyledNavLink>
            <StyledNavLink id={`swap-nav-link`} to={'/pool'}>
              Pool
            </StyledNavLink>
            <StyledNavLink id={`swap-nav-link`} to={'/farm'}>
              Farm
            </StyledNavLink>
          </HeaderLinks>
        </HeaderElement>
        <HeaderControls>
          <HeaderElement>
            <TestnetWrapper>
              {!isMobile && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} OMC
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            <Settings />
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
