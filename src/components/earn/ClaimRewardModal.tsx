import React, { useState } from 'react'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonError } from '../Button'
import { DoubleSideStakingInfo, useMinichefPools } from '../../state/stake/hooks'
import { useStakingContract } from '../../hooks/useContract'
import { SubmittedView, LoadingView } from '../ModalViews'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useActiveWeb3React } from '../../hooks'
import { TokenAmount } from '@uniswap/sdk'
import { theme } from '../../theme'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: DoubleSideStakingInfo
  version: number
  extraRewardTokensAmount?: Array<TokenAmount>
}

export default function ClaimRewardModal({
  isOpen,
  onDismiss,
  stakingInfo,
  version,
  extraRewardTokensAmount
}: StakingModalProps) {
  const { account } = useActiveWeb3React()
  // monitor call to help UI loading state
  const addTransaction = useTransactionAdder()
  const [hash, setHash] = useState<string | undefined>()
  const [attempting, setAttempting] = useState(false)

  function wrappedOnDismiss() {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }

  const poolMap = useMinichefPools()

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)
  const isSuperFarm = extraRewardTokensAmount && extraRewardTokensAmount?.length > 0

  async function onClaimReward() {
    if (stakingContract && poolMap && stakingInfo?.stakedAmount) {
      setAttempting(true)
      const method = version < 2 ? 'getReward' : 'harvest'
      const args = version < 2 ? [] : [poolMap[stakingInfo.stakedAmount.token.address], account]

      await stakingContract[method](...args)
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Claim accumulated OMLT Rewards'
          })
          setHash(response.hash)
        })
        .catch((error: any) => {
          setAttempting(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    }
  }

  let errorMessage: string | undefined
  if (!account) {
    errorMessage = 'Connect Wallet'
  }
  if (!stakingInfo?.stakedAmount) {
    errorMessage = errorMessage ?? 'Enter an Amount'
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>{'Claim'}</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.main fontWeight={600} fontSize={36}>
                {stakingInfo?.earnedAmount?.toSignificant(6)}
              </TYPE.main>
              <TYPE.main>{'Unclaimed OMLT'}</TYPE.main>
            </AutoColumn>
          )}
          {isSuperFarm &&
            extraRewardTokensAmount?.map((rewardAmount, i) => (
              <AutoColumn justify="center" gap="md" key={i}>
                <TYPE.main fontWeight={600} fontSize={36}>
                  {rewardAmount?.toSignificant(6)}
                </TYPE.main>
                <TYPE.main>{'Unclaimed ' + rewardAmount?.token?.symbol}</TYPE.main>
              </AutoColumn>
            ))}
          <TYPE.main style={{ textAlign: 'center' }}>
            {'When you claim without withdrawing your liquidity remains in the mining pool.'}
          </TYPE.main>
          <ButtonError
            disabled={!!errorMessage}
            error={!!errorMessage && !!stakingInfo?.stakedAmount}
            onClick={onClaimReward}
          >
            {errorMessage ? errorMessage : isSuperFarm ? 'Claim' : 'Claim OMLT'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.main fontSize={20}>{'Claiming ' + stakingInfo?.earnedAmount?.toSignificant(6) + ' OMLT'}</TYPE.main>

            {isSuperFarm &&
              extraRewardTokensAmount?.map((rewardAmount, i) => (
                <TYPE.main fontSize={20} key={i}>
                  {'Claiming ' + rewardAmount?.toSignificant(6) + ' ' + rewardAmount?.token?.symbol}
                </TYPE.main>
              ))}
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.main fontWeight={600} fontSize={24}>
              {'Transaction Submitted'}
            </TYPE.main>
            <TYPE.main fontSize={20}>{'Unclaimed OMLT'}</TYPE.main>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
