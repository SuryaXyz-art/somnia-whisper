'use client';

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { useState, useEffect } from 'react';
import { NEXT_PUBLIC_CONTRACT_ADDRESS } from '@/lib/config';
import { FORTUNE_ABI } from '@/lib/abi';

export interface FortuneNFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  rarity: string;
  timestamp: string;
}

export function useWalletFortunes() {
  const { address } = useAccount();
  const [fortunes, setFortunes] = useState<FortuneNFT[]>([]);
  const [isDecoding, setIsDecoding] = useState(false);

  // 1. Get Balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: FORTUNE_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  });

  // 2. Fetch Token IDs
  const tokenIndexCalls = Array.from({ length: Number(balance || 0) }).map((_, i) => ({
    address: NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: FORTUNE_ABI,
    functionName: 'tokenOfOwnerByIndex' as const,
    args: [address!, BigInt(i)] as const,
  }));

  const { data: tokenIdsResult, isLoading: isLoadingIds, refetch: refetchIds } = useReadContracts({
    contracts: tokenIndexCalls,
    query: { enabled: !!balance && balance > 0n },
  });

  // 3. Fetch Token URIs
  const tokenURICalls = (tokenIdsResult || []).map((res) => ({
    address: NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: FORTUNE_ABI,
    functionName: 'tokenURI' as const,
    args: [res.result as bigint] as const,
  })).filter(call => call.args[0] !== undefined);

  const { data: urisResult, isLoading: isLoadingURIs, refetch: refetchURIs } = useReadContracts({
    contracts: tokenURICalls,
    query: { enabled: !!tokenIdsResult && tokenIdsResult.length > 0 },
  });

  useEffect(() => {
    if (urisResult && tokenIdsResult) {
      setIsDecoding(true);
      const decoded = urisResult.map((res, i) => {
        if (res.status === 'success' && res.result) {
          try {
            const base64 = (res.result as string).split(',')[1];
            const json = JSON.parse(atob(base64));
            
            // Extract attributes if available in metadata
            const rarityAttr = json.attributes?.find((a: any) => a.trait_type === 'Rarity')?.value;
            const timeAttr = json.attributes?.find((a: any) => a.trait_type === 'Inscribed')?.value;

            return {
              tokenId: tokenIdsResult[i]?.result?.toString() || '?',
              name: json.name,
              description: json.description,
              image: json.image,
              rarity: rarityAttr || 'COMMON',
              timestamp: timeAttr || 'Unknown',
            };
          } catch (e) {
            console.error("Metadata decode error", e);
            return null;
          }
        }
        return null;
      }).filter(n => n !== null) as FortuneNFT[];
      
      setFortunes(decoded);
      setIsDecoding(false);
    } else if (balance === 0n) {
      setFortunes([]);
    }
  }, [urisResult, tokenIdsResult, balance]);

  const refetch = () => {
    refetchBalance();
    refetchIds();
    refetchURIs();
  };

  return {
    fortunes,
    isLoading: isLoadingIds || isLoadingURIs || isDecoding,
    refetch
  };
}
