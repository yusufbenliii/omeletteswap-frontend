import React, { useState, useCallback } from 'react'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { TYPE, CloseIcon } from '../../theme'
import { ButtonConfirmed, ButtonError } from '../Button'
import ProgressCircles from '../ProgressSteps'
import CurrencyInputPanel from '../CurrencyInputPanel'
import { TokenAmount, Pair, ChainId } from '@uniswap/sdk'
import { useActiveWeb3React } from '../../hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { usePairContract, useStakingContract } from '../../hooks/useContract'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import { splitSignature } from 'ethers/lib/utils'
import { DoubleSideStakingInfo, useDerivedStakeInfo, useMinichefPools } from '../../state/stake/hooks'
import { wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { LoadingView, SubmittedView } from '../ModalViews'

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
  text-align: right;
  margin-top: 1rem;
`

const HypotheticalRewardRate = styled.div<{ dim: boolean }>`
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
  padding-left: 20px;

  opacity: ${({ dim }) => (dim ? 0.5 : 1)};
`

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  padding: 1rem;
`

interface StakingModalProps {
  isOpen: boolean
  onDismiss: () => void
  stakingInfo: DoubleSideStakingInfo
  userLiquidityUnstaked: TokenAmount | undefined
  version: number
  extraRewardTokensAmount?: Array<TokenAmount>
}

export default function StakingModal({
  isOpen,
  onDismiss,
  stakingInfo,
  userLiquidityUnstaked,
  version,
  extraRewardTokensAmount
}: StakingModalProps) {
  const { account, library } = useActiveWeb3React()
  const chainId = ChainId.OMCHAIN
  // track and parse user input
  const [typedValue, setTypedValue] = useState('')
  const { parsedAmount, error } = useDerivedStakeInfo(typedValue, stakingInfo.stakedAmount.token, userLiquidityUnstaked)
  const parsedAmountWrapped = wrappedCurrencyAmount(parsedAmount, chainId)

  let hypotheticalWeeklyRewardRate: TokenAmount = new TokenAmount(stakingInfo.rewardRatePerWeek.token, '0')
  if (parsedAmountWrapped?.greaterThan('0')) {
    hypotheticalWeeklyRewardRate = stakingInfo.getHypotheticalWeeklyRewardRate(
      stakingInfo.stakedAmount.add(parsedAmountWrapped),
      stakingInfo.totalStakedAmount.add(parsedAmountWrapped),
      stakingInfo.totalRewardRatePerSecond
    )
  }

  // state for pending and submitted txn views
  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const wrappedOnDismiss = useCallback(() => {
    setHash(undefined)
    setAttempting(false)
    onDismiss()
  }, [onDismiss])

  // pair contract for this token to be staked
  const dummyPair = new Pair(new TokenAmount(stakingInfo.tokens[0], '0'), new TokenAmount(stakingInfo.tokens[1], '0'))
  const pairContract = usePairContract(dummyPair.liquidityToken.address)

  // approval data for stake
  const deadline = useTransactionDeadline()
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmount, stakingInfo.stakingRewardAddress)

  const stakingContract = useStakingContract(stakingInfo.stakingRewardAddress)
  const poolMap = useMinichefPools()
  const isSuperFarm = (extraRewardTokensAmount || [])?.length > 0

  async function onStake() {
    if (stakingContract && poolMap && parsedAmount && deadline) {
      setAttempting(true)
      const method = version < 2 ? 'stake' : 'deposit'
      const args =
        version < 2
          ? [`0x${parsedAmount.raw.toString(16)}`]
          : [poolMap[stakingInfo.stakedAmount.token.address], `0x${parsedAmount.raw.toString(16)}`, account]
      if (approval === ApprovalState.APPROVED) {
        stakingContract[method](...args)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Deposit liquidity'
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
      } else if (signatureData) {
        const permitMethod = version < 2 ? 'stakeWithPermit' : 'depositWithPermit'
        const permitArgs =
          version < 2
            ? [
                `0x${parsedAmount.raw.toString(16)}`,
                signatureData.deadline,
                signatureData.v,
                signatureData.r,
                signatureData.s
              ]
            : [
                poolMap[stakingInfo.stakedAmount.token.address],
                `0x${parsedAmount.raw.toString(16)}`,
                account,
                signatureData.deadline,
                signatureData.v,
                signatureData.r,
                signatureData.s
              ]

        stakingContract[permitMethod](...permitArgs)
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: 'Deposit liquidity'
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
      } else {
        setAttempting(false)
        throw new Error('Attempting to stake without approval or a signature. Please contact support.')
      }
    }
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback((typedValue: string) => {
    setSignatureData(null)
    setTypedValue(typedValue)
  }, [])

  // used for max input button
  const maxAmountInput = maxAmountSpend(userLiquidityUnstaked)
  const atMaxAmount = Boolean(maxAmountInput && parsedAmount?.equalTo(maxAmountInput))
  const handleMax = useCallback(() => {
    maxAmountInput && onUserInput(maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  async function onAttemptToApprove() {
    if (!pairContract || !library || !deadline) throw new Error('missing dependencies.')

    const liquidityAmount = parsedAmount
    if (!liquidityAmount) throw new Error('missing liquidity amount')

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' }
    ]
    const domain = {
      name: 'Omelette LP Token',
      version: '1',
      chainId: chainId,
      verifyingContract: pairContract.address
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
    const message = {
      owner: account,
      spender: stakingInfo.stakingRewardAddress,
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber()
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit
      },
      domain,
      primaryType: 'Permit',
      message
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then(signature => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber()
        })
      })
      .catch(error => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (error?.code !== 4001) {
          approveCallback()
        }
      })
  }

  return (
    <Modal isOpen={isOpen} onDismiss={wrappedOnDismiss} maxHeight={90}>
      {!attempting && !hash && (
        <ContentWrapper gap="lg">
          <RowBetween>
            <TYPE.mediumHeader>{'Deposit'}</TYPE.mediumHeader>
            <CloseIcon onClick={wrappedOnDismiss} />
          </RowBetween>
          <CurrencyInputPanel
            value={typedValue}
            onUserInput={onUserInput}
            onMax={handleMax}
            showMaxButton={!atMaxAmount}
            currency={stakingInfo.stakedAmount.token}
            pair={dummyPair}
            label={''}
            disableCurrencySelect={true}
            id="stake-liquidity-token"
          />

          <HypotheticalRewardRate dim={!hypotheticalWeeklyRewardRate.greaterThan('0')}>
            <div>
              <TYPE.main fontWeight={600}>{'Weekly Rewards'}</TYPE.main>
            </div>

            <TYPE.main>
              {hypotheticalWeeklyRewardRate.toSignificant(4, { groupSeparator: ',' })} {'OMLT / week'}
            </TYPE.main>
          </HypotheticalRewardRate>

          {isSuperFarm && (
            <HypotheticalRewardRate dim={!hypotheticalWeeklyRewardRate.greaterThan('0')}>
              <div>
                <TYPE.main fontWeight={600}>{'Extra Reward'}</TYPE.main>
              </div>

              {extraRewardTokensAmount?.map((reward, index) => {
                const tokenMultiplier = stakingInfo?.rewardTokensMultiplier?.[index]
                const extraTokenWeeklyRewardRate = stakingInfo?.getExtraTokensWeeklyRewardRate?.(
                  hypotheticalWeeklyRewardRate,
                  reward?.token,
                  tokenMultiplier
                )
                if (extraTokenWeeklyRewardRate) {
                  return (
                    <TYPE.main key={index}>
                      {extraTokenWeeklyRewardRate.toSignificant(4, { groupSeparator: ',' })}{' '}
                      {reward?.token?.symbol + ' / week'}
                    </TYPE.main>
                  )
                }
                return null
              })}
            </HypotheticalRewardRate>
          )}

          <RowBetween>
            <ButtonConfirmed
              mr="0.5rem"
              onClick={onAttemptToApprove}
              confirmed={approval === ApprovalState.APPROVED || signatureData !== null}
              disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
            >
              {'Approve'}
            </ButtonConfirmed>
            <ButtonError
              disabled={!!error || (signatureData === null && approval !== ApprovalState.APPROVED)}
              error={!!error && !!parsedAmount}
              onClick={onStake}
            >
              {error ?? 'Deposit'}
            </ButtonError>
          </RowBetween>
          <ProgressCircles steps={[approval === ApprovalState.APPROVED || signatureData !== null]} disabled={true} />
        </ContentWrapper>
      )}
      {attempting && !hash && (
        <LoadingView onDismiss={wrappedOnDismiss}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.main fontWeight={600} fontSize={24}>
              {'Depositing Liquidity'}
            </TYPE.main>
            <TYPE.main fontSize={20}>{parsedAmount?.toSignificant(4)} OMLT-LP</TYPE.main>
          </AutoColumn>
        </LoadingView>
      )}
      {attempting && hash && (
        <SubmittedView onDismiss={wrappedOnDismiss} hash={hash}>
          <AutoColumn gap="12px" justify={'center'}>
            <TYPE.main fontWeight={600} fontSize={24}>
              {'Transaction Submitted'}
            </TYPE.main>
            <TYPE.main fontSize={20}>
              {'Deposited'} {parsedAmount?.toSignificant(4)} OMLT-LP
            </TYPE.main>
          </AutoColumn>
        </SubmittedView>
      )}
    </Modal>
  )
}
