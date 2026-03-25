'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, decodeEventLog } from 'viem';
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from '@/lib/config';
import { FORTUNE_ABI } from '@/lib/abi';

interface UseFortuneMintProps {
  fortuneText: string;
  txCount: number;
  totalValueEth: string;
}

export function useFortuneMint() {
  const [tokenId, setTokenId] = useState<string | null>(null);
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess && receipt) {
      // Find TokenId in logs
      const log = receipt.logs.find(
        (l) => l.address.toLowerCase() === NEXT_PUBLIC_CONTRACT_ADDRESS?.toLowerCase()
      );
      if (log) {
        try {
          const decoded = decodeEventLog({
            abi: FORTUNE_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === 'FortuneMinted') {
            setTokenId(decoded.args.tokenId.toString());
          }
        } catch (e) {
          console.error("Failed to decode mint log", e);
        }
      }
    }
  }, [isSuccess, receipt]);

  const mint = async (props: UseFortuneMintProps) => {
    if (!NEXT_PUBLIC_CONTRACT_ADDRESS) return;

    writeContract({
      address: NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: FORTUNE_ABI,
      functionName: 'mintFortune',
      args: [
        props.fortuneText,
        BigInt(props.txCount),
        parseEther(props.totalValueEth)
      ],
      value: parseEther('0.001'), // Fixed mint price
    });
  };

  return {
    mint,
    isPending,
    isConfirming,
    isConfirmed: isSuccess,
    txHash: hash,
    tokenId,
    error
  };
}
