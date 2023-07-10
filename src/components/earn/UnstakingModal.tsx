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
import FormattedCurrencyAmount from '../FormattedCurrencyAmount'
import { useActiveWeb3React } from '../../hooks'
import { TokenAmount } from '@uniswap/sdk'

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

export default function UnstakingModal({
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

  async function onWithdraw() {
    if (stakingContract && poolMap && stakingInfo?.stakedAmount) {
      setAttempting(true)
      const method = version < 2 ? 'exit' : 'withdrawAndHarvest'
      const args =
        version < 2
          ? []
          : [
              poolMap[stakingInfo.stakedAmount.token.address],
              `0x${stakingInfo.stakedAmount?.raw.toString(16)}`,
              account
            ]

      // TODO: Support withdrawing partial amounts for v2+
      await stakingContract[method](...args)
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Withdraw deposited liquidity'
          })
          setHash(response.hash)
        })
        .catch((_error: any) => {
          setAttempting(false)
        })
    }
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!stakingInfo?.stakedAmount) {
    error = error ?? 'Enter an Amount'
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>Withdraw</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          {stakingInfo?.stakedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo.stakedAmount} />}
              </TYPE.body>
              <TYPE.body>{'Deposited OMLT-LP liquidity'}</TYPE.body>
            </AutoColumn>
          )}
          {stakingInfo?.earnedAmount && (
            <AutoColumn justify="center" gap="md">
              <TYPE.body fontWeight={600} fontSize={36}>
                {<FormattedCurrencyAmount currencyAmount={stakingInfo?.earnedAmount} />}
              </TYPE.body>
              <TYPE.main>{'Your unclaimed OMLT'}</TYPE.main>
            </AutoColumn>
          )}
          {isSuperFarm &&
            extraRewardTokensAmount?.map((rewardAmount, i) => (
              <AutoColumn justify="center" gap="md" key={i}>
                <TYPE.body fontWeight={600} fontSize={36}>
                  {<FormattedCurrencyAmount currencyAmount={rewardAmount} />}
                </TYPE.body>
                <TYPE.main>{'Your unclaimed ' + rewardAmount?.token?.symbol}</TYPE.main>
              </AutoColumn>
            ))}
          <TYPE.subHeader style={{ textAlign: 'center' }}>
            {
              'When you withdraw, your OMLT is claimed and your Omelette Swap Liquidity tokens, OMLT-LP, are returned to you. You will no longer earn OMLT rewards on this liquidity. Your original token liquidity will remain in its liquidity pool.'
            }
          </TYPE.subHeader>
          <ButtonError disabled={!!error} error={!!error && !!stakingInfo?.stakedAmount} onClick={onWithdraw}>
            {error ?? 'Withdraw & Claim'}
          </ButtonError>
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.body fontSize={20}>
              {'Withdrawing ' + stakingInfo?.stakedAmount?.toSignificant(4) + ' OMLT-LP'}
            </TYPE.body>
            <TYPE.body fontSize={20}>
              {'Claiming ' + stakingInfo?.earnedAmount?.toSignificant(4) + ' OMLT'}
              {isSuperFarm &&
                extraRewardTokensAmount?.map((rewardAmount, i) => (
                  <TYPE.body fontSize={20} key={i}>
                    {'Claiming ' + rewardAmount?.toSignificant(4) + ' ' + rewardAmount?.token?.symbol}
                  </TYPE.body>
                ))}
            </TYPE.body>
          </AutoColumn>
        </LoadingView>
      )}
      {hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.largeHeader>{'Transaction Submitted'}</TYPE.largeHeader>
            <TYPE.body fontSize={20}>{'Withdrew OMLT-LP'}</TYPE.body>
            <TYPE.body fontSize={20}>{'Your unclaimed OMLT'}</TYPE.body>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
