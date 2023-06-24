/* eslint-disable react/no-unescaped-entities */
import { darken } from 'polished'
import React, { useEffect } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
import omeletteLogo from '../../assets/images/omelette_logo.png'
import { Hidden } from '../../theme/components'
import { theme } from '../../theme'

const PageWrapper = styled(AutoColumn)``

const IDOContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};
`

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`

const Description = styled.div`
  margin-top: 8px;
  font-size: 14px;
`

const Buttons = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
`

const ProgressText = styled.div`
  font-size: 14px;
  color: #fff;
  margin-top: 14px;
`

const LeftSection = styled.div`
  padding: 14px 10px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Adjust the vertical alignment */
  align-items: center;
  width: 45%;
  height: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 95%;
  `};
`

const RightSection = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto auto;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  align-items: center;
  width: 55%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 100%;
`};
`

const Box = styled.div`
  padding: 1.25rem 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  outline: none;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
`

const InfoBox = styled.div`
  padding: 3rem 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  outline: none;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  gap: 16px;
`

const ProgressBox = styled(Box)`
  padding: 1rem 4rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
`

const RightRound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

const LogoTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 15px;
  `};
`

const Symbol = styled.div`
  font-size: 16px;
  color: #888;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 10px;
  `};
`

const ProgressBar = styled.div`
  width: 42%;
  height: 8px;
  background-color: #ccc;
  border-radius: 4px;
  margin-top: 16px;
`

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #00aaff;
  border-radius: 4px;
`

const IdoButton = styled.button`
  /* Button base styles */
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 6px;
  /* Primary variant styles */
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text1};
  border: none;
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
`
const BuyButton = styled(IdoButton)`
  padding: 18px 14px;
`

const LeftHeader = styled.div`
  padding: 6px 6px;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: space-between;
  width: 100%;
`

const InputHeader = styled.div`
  padding: 6px 6px;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`

const RightHeader = styled.div`
  display: flex;
  flex-direction: column;
`

const RightHeaderText = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 30px;
  justify-content: center;
`

const TimeLine = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`

const TimeLineContainer = styled(TimeLine)`
  flex-direction: column;
  width: 100%;
  gap: 16px;
`

const TimeLineBox = styled(Box)`
  width: 95%;
  flex-direction: row;
`

const ProgressIcon = styled.div`
  width: 42px;
  height: 42px;
  padding: 16px 16px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 26px;
  height: 26px;
  `};
`

const IconSize = styled.div`
  font-size: 24px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 14px;
  `};
`

/* const Dots = styled.div`
  position: relative;
  top: auto;
  right: auto;
  z-index: 2;
  width: 100px;
  height: 1px;
  padding-top: 0;
  flex: 1;
  border-bottom: 1px dashed #ccc;
` */

const Input = styled.input`
  width: 50%;
  height: 48px;
  padding: 0 16px;
  margin-right: 8px;
  border-radius: 12px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 16px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export default function IdoDetail({
  match: {
    params: { id }
  }
}: RouteComponentProps<{ id?: string }>) {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [approved, setApproved] = React.useState(false)
  const { t } = useTranslation()
  console.log('this is the id', id)
  return (
    <PageWrapper gap="lg" justify="center">
      <IDOContainer>
        <LeftSection>
          <InfoBox>
            <Title>{'What is Omelette?'}</Title>
            <Description>
              {
                'Lorem ipsum dolor sit ametLorem ipsum dolor sit amet Lorem ipsum dolor sit ametLorem ipsum dolor sit amet'
              }
            </Description>
            <Buttons>
              <IdoButton>{t('Linktree')}</IdoButton>
              <IdoButton>{t('Add OMLT to Metamask')}</IdoButton>
              <IdoButton>{t('Add Omchain Network')}</IdoButton>
            </Buttons>
          </InfoBox>
        </LeftSection>
        <RightSection>
          <Box>
            <LeftHeader>
              <img src={omeletteLogo} alt="logo" width={50} height={50} />
              <RightHeaderText>
                <Symbol>OmelletteSwap</Symbol>
                <LogoTitle>OMLT</LogoTitle>
              </RightHeaderText>
              <RightRound>
                <Symbol>Price</Symbol>
                <LogoTitle>$0.006</LogoTitle>
              </RightRound>
            </LeftHeader>
          </Box>
          {!modalOpen && (
            <Box>
              <LeftHeader>
                <RightHeader>
                  <Symbol>Round</Symbol>
                  <LogoTitle>Public</LogoTitle>
                </RightHeader>
                <RightRound>
                  <Symbol>Time Left</Symbol>
                  <LogoTitle>09:22:34:45</LogoTitle>
                </RightRound>
              </LeftHeader>
            </Box>
          )}
          <Box>
            <LeftHeader>
              <Symbol>Progress</Symbol>
              <Symbol>%42</Symbol>
            </LeftHeader>
            <ProgressBar>
              <ProgressBarFill></ProgressBarFill>
            </ProgressBar>
            <ProgressText>22,222,222 / 100,000,000 OMLT SOLD</ProgressText>
          </Box>
          {modalOpen && (
            <Box>
              <LeftHeader>
                <RightHeader>
                  <Symbol>Min Allocation</Symbol>
                  <LogoTitle>100 USDT</LogoTitle>
                </RightHeader>
                <RightRound>
                  <Symbol>Max Allocation</Symbol>
                  <LogoTitle>5000 USDT</LogoTitle>
                </RightRound>
              </LeftHeader>
              <InputHeader>
                <Input type="number" />
                <LogoTitle>USDT</LogoTitle>
              </InputHeader>
            </Box>
          )}
          {!modalOpen || (modalOpen && approved) ? (
            <BuyButton
              onClick={() => {
                setModalOpen(true)
              }}
            >
              {t('Buy OMLT')}
            </BuyButton>
          ) : (
            <BuyButton
              onClick={() => {
                setApproved(true)
              }}
            >
              {t('Approve USDT')}
            </BuyButton>
          )}
        </RightSection>
      </IDOContainer>
      {/*       <Hidden upToMedium={true}>
        {!modalOpen && (
          <TimeLine>
            <ProgressBox>
              <ProgressIcon>
                <IconSize>1</IconSize>
              </ProgressIcon>
              <h3>Whitelist Round</h3>
              <p>Date: 25/07/2023</p>
              <p>Time: 14 days</p>
            </ProgressBox>
            <Dots></Dots>
            <ProgressBox className="process-card text-center px-4 py-lg-5 py-3 rounded-custom shadow-hover mb-2 mb-lg-0">
              <ProgressIcon>
                <IconSize>2</IconSize>
              </ProgressIcon>
              <h3>Public Round</h3>
              <p>Date: 25/07/2023</p>
              <p>Time: 14 days</p>
            </ProgressBox>
            <Dots></Dots>
            <ProgressBox>
              <ProgressIcon>
                <IconSize>3</IconSize>
              </ProgressIcon>
              <h3>Sale Ends</h3>
              <p>Date: 25/07/2023</p>
              <p>Time: 14 days</p>
            </ProgressBox>
          </TimeLine>
        )}
      </Hidden> */}
      {!modalOpen && (
        <TimeLineContainer>
          <TimeLineBox>
            <LeftHeader>
              <ProgressIcon>
                <IconSize>1</IconSize>
              </ProgressIcon>{' '}
              <RightRound>
                <LogoTitle>Whitelist Round</LogoTitle>
              </RightRound>
              <RightRound>
                <Symbol>Date</Symbol>
                <Symbol>25/07/2023</Symbol>
              </RightRound>
              <RightRound>
                <Symbol>Time</Symbol>
                <Symbol>14 days</Symbol>
              </RightRound>
            </LeftHeader>
          </TimeLineBox>
          <TimeLineBox>
            <LeftHeader>
              <ProgressIcon>
                <IconSize>2</IconSize>
              </ProgressIcon>{' '}
              <RightRound>
                <LogoTitle>Public Round</LogoTitle>
              </RightRound>
              <RightRound>
                <Symbol>Date</Symbol>
                <Symbol>25/07/2023</Symbol>
              </RightRound>
              <RightRound>
                <Symbol>Time</Symbol>
                <Symbol>14 days</Symbol>
              </RightRound>
            </LeftHeader>
          </TimeLineBox>
          <TimeLineBox>
            <LeftHeader>
              <ProgressIcon>
                <IconSize>3</IconSize>
              </ProgressIcon>{' '}
              <RightRound>
                <LogoTitle>Sale Ends</LogoTitle>
              </RightRound>
              <RightRound>
                <Symbol>Date</Symbol>
                <Symbol>25/07/2023</Symbol>
              </RightRound>
              <RightRound>
                <Symbol>Time</Symbol>
                <Symbol>14 days</Symbol>
              </RightRound>
            </LeftHeader>
          </TimeLineBox>
        </TimeLineContainer>
      )}
    </PageWrapper>
  )
}
