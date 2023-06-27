/* eslint-disable @typescript-eslint/no-misused-new */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/no-unescaped-entities */
import { darken } from 'polished'
import React, { useEffect } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import omeletteLogo from '../../assets/images/omelette_logo.png'
import { ExternalLink } from '../../theme'
import { useActiveWeb3React } from '../../hooks/index'
import { injected } from '../../connectors/index'

const PageWrapper = styled(AutoColumn)`
  justify-content: start;
`

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
  color: #888;
`

const Description = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #888;
`

const Buttons = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
`

const ProgressText = styled.div`
  font-size: 14px;
  color: #888;
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
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  outline: none;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`

const InfoBox = styled.div`
  padding: 3rem 2rem;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  outline: none;
  color: ${({ theme }) => theme.text1};
  text-decoration: none;
  background-color: ${({ theme }) => theme.bg1};
  gap: 16px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`

const RightRound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0 0 0 30px;
  width: 20%;
`

const MenuRightRound = styled(RightRound)`
  align-items: flex-end;
  width: 50%;
`

const RoundSection = styled.div`
  min-width: 5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 60%;
`

const LogoTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #888;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 15px;
  `};
`

const RoundTitle = styled(LogoTitle)`
  margin-left: 8px;
`

const Symbol = styled.div`
  font-size: 16px;
  color: #888;
  ${({ theme }) => theme.mediaWidth.upToSmall`
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
  border-radius: 30px;
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
  width: 36px;
  height: 36px;
  padding: 16px 16px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  width: 22px;
  height: 22px;
  `};
`

const IconSize = styled.div`
  font-size: 20px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 14px;
  `};
`

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
  const [provider, setProvider] = React.useState<any>()
  const { library } = useActiveWeb3React()
  const { t } = useTranslation()

  useEffect(() => {
    if (injected) {
      const injectedProvider = async () => {
        setProvider(await injected.getProvider())
      }
      injectedProvider()
    }
  }, [injected])

  async function addOMLTtoMetamask() {
    if (provider) {
      try {
        const watchAssetVar = await provider.request(
          {
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Corrected type value
              options: {
                address: '0x6BEB3a2B9B54178E7EA3D9edb893Bec92f50B4E5',
                symbol: 'TT',
                decimals: 18,
                image:
                  'https://github.com/yusufbenliii/omeletteswap-frontend/assets/67913214/77a91596-dc80-49aa-bf26-cf0183a61b7e'
              }
            }
          },
          (error: any, response: any) => {
            console.log('response:', response)
            if (error) {
              console.error('Failed to add OMLT Token:', error)
            } else {
              console.log('OMLT Token added successfully')
            }
          }
        )
        if (watchAssetVar) {
          console.log('OMLT Token added successfully')
          alert('OMLT Token added successfully')
        }
      } catch (error) {
        console.error('Failed to add Omchain network:', error)
      }
    } else {
      console.error('Web3Provider or provider.request not available')
    }
  }

  async function addOmchainNetwork() {
    if (provider) {
      const networkData = {
        chainId: '0x5538', // Chain ID of Omchain (21816 in decimal)
        chainName: 'omChain Mainnet', // Name of the network
        nativeCurrency: {
          name: 'Omchain Token', // Name of the native currency
          symbol: 'OMC', // Symbol of the native currency
          decimals: 18 // Decimals of the native currency
        },
        rpcUrls: ['https://seed.omchain.io'], // Replace with the RPC URL of Omchain
        blockExplorerUrls: ['https://explorer.omchain.io'] // Replace with the block explorer URL of Omchain
      }
      try {
        console.log('Adding Omchain network')
        await provider.request(
          {
            method: 'wallet_addEthereumChain',
            params: [networkData]
          },
          (error: any, response: any) => {
            console.log('response:', response)
            if (error) {
              console.error('Failed to add Omchain network:', error)
            } else {
              console.log('Omchain network added successfully')
            }
          }
        )
      } catch (error) {
        console.error('Failed to add Omchain network:', error)
      }
    } else {
      console.error('Web3Provider or provider.request not available')
    }
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <IDOContainer>
        <LeftSection>
          <InfoBox>
            <Title>{'What is Omelette?'}</Title>
            <Description>
              {'#1 Decentralized Exchange for trading and liquidity provisioning on '}
              <ExternalLink href="https://twitter.com/omchainio">
                <span>Omchain</span>
              </ExternalLink>
            </Description>
            <Buttons>
              <ExternalLink href="https://linktr.ee/omeletteswap">
                <IdoButton>{t('Linktree')}</IdoButton>
              </ExternalLink>
              <IdoButton
                onClick={() => {
                  addOMLTtoMetamask()
                }}
              >
                {t('Add OMLT to Metamask')}
              </IdoButton>
              <IdoButton
                onClick={() => {
                  addOmchainNetwork()
                }}
              >
                {t('Add Omchain Network')}
              </IdoButton>
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
              <MenuRightRound>
                <Symbol>Price</Symbol>
                <LogoTitle>$0.006</LogoTitle>
              </MenuRightRound>
            </LeftHeader>
          </Box>
          {!modalOpen && (
            <Box>
              <LeftHeader>
                <RightHeader>
                  <Symbol>Round</Symbol>
                  <LogoTitle>Public</LogoTitle>
                </RightHeader>
                <MenuRightRound>
                  <Symbol>Time Left</Symbol>
                  <LogoTitle>09:22:34:45</LogoTitle>
                </MenuRightRound>
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
                <MenuRightRound>
                  <Symbol>Max Allocation</Symbol>
                  <LogoTitle>5000 USDT</LogoTitle>
                </MenuRightRound>
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

      {!modalOpen && (
        <TimeLineContainer>
          <TimeLineBox>
            <RoundSection>
              <ProgressIcon>
                <IconSize>1</IconSize>
              </ProgressIcon>{' '}
              <RoundTitle>Whitelist Round</RoundTitle>
            </RoundSection>
            <RightRound>
              <Symbol>Date</Symbol>
              <Symbol>25/07/2023</Symbol>
            </RightRound>
            <RightRound>
              <Symbol>Time</Symbol>
              <Symbol>14 days</Symbol>
            </RightRound>
          </TimeLineBox>
          <TimeLineBox>
            <RoundSection>
              <ProgressIcon>
                <IconSize>2</IconSize>
              </ProgressIcon>{' '}
              <RoundTitle>Public Round</RoundTitle>
            </RoundSection>
            <RightRound>
              <Symbol>Date</Symbol>
              <Symbol>25/07/2023</Symbol>
            </RightRound>
            <RightRound>
              <Symbol>Time</Symbol>
              <Symbol>14 days</Symbol>
            </RightRound>
          </TimeLineBox>
          <TimeLineBox>
            <RoundSection>
              <ProgressIcon>
                <IconSize>3</IconSize>
              </ProgressIcon>{' '}
              <RoundTitle>Sale Ends</RoundTitle>
            </RoundSection>
            <RightRound>
              <Symbol>Date</Symbol>
              <Symbol>25/07/2023</Symbol>
            </RightRound>
            <RightRound>
              <Symbol>Time</Symbol>
              <Symbol>14 days</Symbol>
            </RightRound>
          </TimeLineBox>
        </TimeLineContainer>
      )}
    </PageWrapper>
  )
}
