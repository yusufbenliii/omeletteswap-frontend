/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import { ChevronDown, ChevronUp } from 'react-feather'
import styled from 'styled-components'
import { DoubleSideStakingInfo } from '../../state/stake/hooks'
import { DOUBLE_SIDE_STAKING_REWARDS_INFO } from '../../state/stake/doubleSideConfig'
import { TYPE, ExternalLink } from '../../theme'
import DoubleSidePoolCard from '../../components/earn/DoubleSidePoolCard'
import { AutoRow, RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import Loader from '../../components/Loader'
import { ChainId } from '@uniswap/sdk'
import { SearchInput } from '../../components/SearchModal/styleds'
import useDebounce from '../../hooks/useDebounce'
import { BIG_INT_ZERO, OMELETTESWAP_API_BASE_URL } from '../../constants'
import Toggle from '../../components/Toggle'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TopSection = styled(AutoColumn)`
  max-width: 720px;
  width: 100%;
`

const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
   flex-direction: column;
 `};
`

const SortSection = styled.div`
  display: flex;
  color: ${({ theme }) => theme.text2};
`
const SortField = styled.div`
  margin: 0px 5px 0px 5px;
  font-weight: 400;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  line-height: 20px;
`

const SortFieldContainer = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToSmall`
   display: none;
 `};
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
   flex-direction: column;
 `};
`

const SuperFarmToggle = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text2};

  .title {
    margin-right: 10px;
  }
`

enum SortingType {
  totalStakedInUsd = 'totalStakedInUsd',
  totalApr = 'totalApr'
}

type ExtendedDoubleSideStakingInfo = DoubleSideStakingInfo & {
  stakingApr: number
  swapFeeApr: number
}

export interface EarnProps {
  version: string
  stakingInfos: Array<DoubleSideStakingInfo>
  poolMap?: { [key: string]: number }
}

const Earn: React.FC<EarnProps> = ({ version, stakingInfos, poolMap }) => {
  const chainId = ChainId.OMCHAIN
  const [poolCardsLoading, setPoolCardsLoading] = useState(false)
  const [poolCards, setPoolCards] = useState<any[]>()
  const [filteredPoolCards, setFilteredPoolCards] = useState<any[]>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<any>({ field: '', desc: true })
  const debouncedSearchQuery = useDebounce(searchQuery, 250)
  const [showSuperFarm, setShowSuperFarm] = useState(true)
  const [stakingInfoData, setStakingInfoData] = useState(stakingInfos as ExtendedDoubleSideStakingInfo[])

  const handleSearch = useCallback(event => {
    setSearchQuery(event.target.value.trim().toUpperCase())
  }, [])

  useEffect(() => {
    const filtered = poolCards?.filter(
      card =>
        card.props.stakingInfo.tokens[0].symbol.toUpperCase().includes(debouncedSearchQuery) ||
        card.props.stakingInfo.tokens[1].symbol.toUpperCase().includes(debouncedSearchQuery)
    )
    setFilteredPoolCards(filtered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolCards, debouncedSearchQuery])

  useEffect(() => {
    console.log('loading farms...')
    const sortedFarms = stakingInfoData.sort(function(info_a, info_b) {
      if (sortBy.field === SortingType.totalStakedInUsd) {
        if (sortBy.desc) {
          return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? BIG_INT_ZERO) ? -1 : 1
        } else {
          return info_a.totalStakedInUsd?.lessThan(info_b.totalStakedInUsd ?? BIG_INT_ZERO) ? -1 : 1
        }
      }

      if (sortBy.field === SortingType.totalApr) {
        if (sortBy.desc) {
          return info_a.stakingApr + info_a.swapFeeApr > info_b.stakingApr + info_b.swapFeeApr ? -1 : 1
        } else {
          return info_a.stakingApr + info_a.swapFeeApr < info_b.stakingApr + info_b.swapFeeApr ? -1 : 1
        }
      }
      return 0
    })
    let finalFarms = sortedFarms
    if (showSuperFarm) {
      // if super farms toggled on then keep all super farms on top
      const nonSuperFarms = sortedFarms.filter(
        item => !item.rewardTokensAddress?.length && !item.stakedAmount.greaterThan(BIG_INT_ZERO)
      )
      const stakedFarms = sortedFarms.filter(item => item.stakedAmount.greaterThan(BIG_INT_ZERO))
      const superFarms = sortedFarms.filter(
        item => (item?.rewardTokensAddress?.length || 0) > 0 && !item.stakedAmount.greaterThan(BIG_INT_ZERO)
      )
      finalFarms = [...stakedFarms, ...superFarms, ...nonSuperFarms]
    }
    const _poolCards = finalFarms.map((stakingInfo, index) => {
      return (
        <DoubleSidePoolCard
          swapFeeApr={stakingInfo.swapFeeApr}
          stakingApr={stakingInfo.stakingApr}
          key={index}
          stakingInfo={stakingInfo}
          version={version}
        />
      )
    })
    setPoolCards(_poolCards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy?.field, sortBy?.desc, showSuperFarm, stakingInfoData])

  useEffect(() => {
    setPoolCardsLoading(true)
    if (stakingInfos?.length > 0) {
      Promise.all(
        stakingInfos
          .filter(function(info) {
            // Only include pools that are live or require a migration
            return !info.isPeriodFinished || info.stakedAmount.greaterThan(BIG_INT_ZERO)
          })
          .sort(function(info_a, info_b) {
            // only first has ended
            if (info_a.isPeriodFinished && !info_b.isPeriodFinished) return 1
            // only second has ended
            if (!info_a.isPeriodFinished && info_b.isPeriodFinished) return -1
            // greater stake in avax comes first
            return info_a.totalStakedInUsd?.greaterThan(info_b.totalStakedInUsd ?? BIG_INT_ZERO) ? -1 : 1
          })
          .sort(function(info_a, info_b) {
            // only the first is being staked, so we should bring the first up
            if (info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && !info_b.stakedAmount.greaterThan(BIG_INT_ZERO))
              return -1
            // only the second is being staked, so we should bring the first down
            if (!info_a.stakedAmount.greaterThan(BIG_INT_ZERO) && info_b.stakedAmount.greaterThan(BIG_INT_ZERO))
              return 1
            return 0
          })
          // TODO: update here api call without staking reward address
          .map(stakingInfo => {
            if (poolMap) {
              return fetch(
                `${OMELETTESWAP_API_BASE_URL}/pangolin/apr2/${poolMap[stakingInfo.totalStakedAmount.token.address]}`
              )
                .then(res => res.json())
                .then(res => ({
                  swapFeeApr: Number(res.swapFeeApr),
                  stakingApr: Number(res.stakingApr),
                  combinedApr: Number(res.combinedApr),
                  ...stakingInfo
                }))
            } else {
              alert('poolMap is not defined')
            }
          })
      ).then(updatedStakingInfos => {
        const _poolCards = updatedStakingInfos.map((stakingInfo, index) => {
          return (
            <DoubleSidePoolCard
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              swapFeeApr={stakingInfo.swapFeeApr}
              // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
              // @ts-ignore
              stakingApr={stakingInfo.stakingApr}
              key={index}
              stakingInfo={stakingInfo}
              version={version}
            />
          )
        })
        setStakingInfoData(updatedStakingInfos)
        setPoolCards(_poolCards)
        setPoolCardsLoading(false)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingInfos?.length, version])

  const stakingRewardsExist = Boolean(
    typeof chainId === 'number' && (DOUBLE_SIDE_STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0
  )
  /* eslint-disable @typescript-eslint/ban-types */
  const getSortField = (label: string, field: string, _sortBy: any, _setSortBy: Function) => {
    return (
      <SortField
        onClick={() => {
          const desc = _sortBy?.field === field ? !_sortBy?.desc : true
          _setSortBy({ field, desc })
        }}
      >
        {label}
        {_sortBy?.field === field && (_sortBy?.desc ? <ChevronDown size="16" /> : <ChevronUp size="16" />)}
      </SortField>
    )
  }

  const toggleSuperFarm = () => {
    setShowSuperFarm(prev => !prev)
  }

  return (
    <PageWrapper gap="lg" justify="center">
      <TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.farmWhite fontSize={16} fontWeight={600}>
                  {'Omelette Swap Liquidity Mining'}
                </TYPE.farmWhite>
              </RowBetween>
              <RowBetween>
                <TYPE.farmWhite fontSize={14}>{'Deposit your OMLT-LP tokens to receive rewards.'}</TYPE.farmWhite>
              </RowBetween>{' '}
              <AutoRow justify="space-between">
                <ExternalLink
                  style={{ color: 'white', textDecoration: 'underline' }}
                  href="https://omeletteswap.gitbook.io/"
                  target="_blank"
                >
                  <TYPE.farmWhite fontSize={14}>{'Read more about OMLT-LP Token'}</TYPE.farmWhite>
                </ExternalLink>
              </AutoRow>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>{'Participating pools'}</TYPE.mediumHeader>
        </DataRow>

        <PoolSection>
          {(stakingRewardsExist && stakingInfos?.length === 0) || poolCardsLoading ? (
            <Loader />
          ) : (!stakingRewardsExist || poolCards?.length === 0) && !poolCardsLoading ? (
            'No Active Rewards'
          ) : (
            <>
              <SearchInput
                type="text"
                id="token-search-input"
                placeholder={'Token Name'}
                value={searchQuery}
                onChange={handleSearch}
              />
              <Actions>
                <SortSection>
                  Sort by :{' '}
                  <SortFieldContainer>
                    {getSortField('Liquidity', SortingType.totalStakedInUsd, sortBy, setSortBy)} |{' '}
                  </SortFieldContainer>
                  {getSortField('APR', SortingType.totalApr, sortBy, setSortBy)}
                </SortSection>
                <SuperFarmToggle>
                  <span className="title">Super Farms</span>
                  <Toggle isActive={showSuperFarm} toggle={toggleSuperFarm} />
                </SuperFarmToggle>
              </Actions>

              {filteredPoolCards}
            </>
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}

export default Earn
