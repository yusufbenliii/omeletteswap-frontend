/* eslint-disable react/no-unescaped-entities */
import { darken } from 'polished'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'

import { IDO_LIST, IDO_STATUS_UPCOMING, IDO_STATUS_ENDED } from '../../constants/idos'

import React from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { TYPE, ExternalLink } from '../../theme'

import { RowBetween } from '../../components/Row'
import { RouteComponentProps } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

const PageWrapper = styled(AutoColumn)``

const TopSection = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const IDOCard = styled(DataCard)`
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

const WrapSmall = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
  `};
  color: ${({ theme }) => theme.text2};
`

/* the idea is to format the partner logos with this one */
const PngIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`
const activeClassName = 'ACTIVE'

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    text-decoration: none;
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      display: none;
`}
`
const IDOs = styled.div`
  padding: 0.75rem 1rem;
  width: 100%;
  margin-top: 1rem;
  border-radius: 12px;
  display: grid;
  grid-template-columns: 60px 1fr 100px;
  align-items: center;
  text-align: left;
  outline: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  &:focus {
    background-color: ${({ theme }) => darken(0.05, theme.bg1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.01, theme.bg1)};
  }
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`

const NothingFound = styled.div`
  color: ${({ theme }) => theme.text2};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function IDO({ history }: RouteComponentProps) {
  const { t } = useTranslation()
  return (
    <PageWrapper gap="lg" justify="center">
      {/* This is the top section of the page */}
      <TopSection gap="md">
        <IDOCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.black fontWeight={600}>{'Initial DEX Offering (IDO)'}</TYPE.black>
              </RowBetween>
              <RowBetween>
                <TYPE.black fontSize={14}>
                  Initial DEX Offerings (IDO) allows projects to crowdfund their native tokens on decentralized
                  exchanges. We've partnered with amazing teams to bring great projects to the Omchain community.
                </TYPE.black>
              </RowBetween>
              <RowBetween></RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </IDOCard>
      </TopSection>
      <TopSection gap="2px">
        <WrapSmall>
          {/* This is the title section of the IDO list */}
          <TYPE.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>
            Upcoming IDOs
          </TYPE.mediumHeader>
        </WrapSmall>
        {/*  We can use this when there are no upcoming IDOs */}
        {!IDO_LIST.some(el => el.status === IDO_STATUS_UPCOMING) && (
          <EmptyProposals>
            <TYPE.body style={{ marginBottom: '8px' }}>{t('IDOPage.noIDOsFound')}</TYPE.body>
            <TYPE.subHeader>
              <i>{t('IDOPage.IDOAnnounced')}</i>
            </TYPE.subHeader>
          </EmptyProposals>
        )}
        {IDO_LIST.filter(ido => ido.status === IDO_STATUS_UPCOMING).length === 0 ? (
          <NothingFound>Nothing found.</NothingFound>
        ) : (
          IDO_LIST.filter(ido => ido.status === IDO_STATUS_UPCOMING).map(filteredIDO => {
            return (
              <IDOs key={filteredIDO.id}>
                <PngIcon>
                  <img width={'50px'} src={filteredIDO.projectIconLocation} alt="logo" />
                </PngIcon>
                <a
                  id={`gov-nav-link`}
                  onClick={() => {
                    history.push(`/ido/${filteredIDO.id}`)
                  }}
                >
                  <NothingFound>
                    {filteredIDO.title} - ${filteredIDO.symbol} IDO<span style={{ fontSize: '11px' }}>↗</span>
                  </NothingFound>
                </a>
              </IDOs>
            )
          })
        )}
      </TopSection>
      <TopSection gap="2px">
        <WrapSmall>
          {/* This is the title section of the IDO list */}
          <TYPE.mediumHeader style={{ margin: '0.5rem 0.5rem 0.5rem 0', flexShrink: 0 }}>Ended IDOs</TYPE.mediumHeader>
        </WrapSmall>
        {IDO_LIST.filter(ido => ido.status === IDO_STATUS_ENDED).length === 0 ? (
          <NothingFound>Nothing found.</NothingFound>
        ) : (
          IDO_LIST.filter(ido => ido.status === IDO_STATUS_ENDED).map(filteredIDO => {
            return (
              <IDOs key={filteredIDO.id}>
                <PngIcon>
                  <img width={'50px'} src={filteredIDO.projectIconLocation} alt="logo" />
                </PngIcon>
                <StyledExternalLink id={`gov-nav-link`} href={filteredIDO.projectUrl}>
                  {filteredIDO.title} Airdrop<span style={{ fontSize: '11px' }}>↗</span>
                </StyledExternalLink>
              </IDOs>
            )
          })
        )}
      </TopSection>
    </PageWrapper>
  )
}
