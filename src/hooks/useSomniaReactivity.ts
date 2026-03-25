'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SDK, WebsocketSubscriptionInitParams } from '@somnia-chain/reactivity';
import { createPublicClient, http, decodeEventLog } from 'viem';
import { somniaTestnet } from '@/lib/chains';
import { NEXT_PUBLIC_CONTRACT_ADDRESS, NEXT_PUBLIC_SOMNIA_RPC } from '@/lib/config';
import { FORTUNE_MINTED_TOPIC, FORTUNE_ABI } from '@/lib/abi';

export interface FortuneEvent {
  tokenId: string;
  wallet: string;
  fortuneText: string;
  rarity: string;
  timestamp: string;
  txHash: string;
}

const RARITY_MAP = ['COMMON', 'RARE', 'LEGENDARY'];

export function useSomniaReactivity() {
  const [liveEvents, setLiveEvents] = useState<FortuneEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'retrying'>('disconnected');
  const [totalMints, setTotalMints] = useState(0);
  
  const retryCount = useRef(0);
  const maxRetries = 5;
  const subscriptionRef = useRef<any>(null);

  const connectReactivity = useCallback(async () => {
    if (retryCount.current >= maxRetries) {
      setConnectionStatus('disconnected');
      return;
    }

    try {
      setConnectionStatus(retryCount.current > 0 ? 'retrying' : 'connecting');
      
      const publicClient = createPublicClient({
        chain: somniaTestnet,
        transport: http(NEXT_PUBLIC_SOMNIA_RPC),
      });

      const sdk = new SDK({ public: publicClient });

      const initParams: WebsocketSubscriptionInitParams = {
        eventContractSources: [NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`],
        topicOverrides: [FORTUNE_MINTED_TOPIC],
        ethCalls: [], // Minimal data for high performance
        onData: (data: any) => {
          // data.log contains the event log
          const { log } = data;
          try {
            const decoded = decodeEventLog({
              abi: FORTUNE_ABI,
              data: log.data,
              topics: log.topics,
            });

            if (decoded.eventName === 'FortuneMinted') {
              const { tokenId, owner, fortuneText, rarity, timestamp } = decoded.args;
              
              const newEvent: FortuneEvent = {
                tokenId: tokenId.toString(),
                wallet: owner as string,
                fortuneText: fortuneText as string,
                rarity: RARITY_MAP[rarity as number] || 'COMMON',
                timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
                txHash: log.transactionHash,
              };

              setLiveEvents((prev) => [newEvent, ...prev].slice(0, 20));
              setTotalMints((prev) => prev + 1);
            }
          } catch (e) {
            console.error('Failed to decode reactive event:', e);
          }
        },
      };

      const subscription = await sdk.subscribe(initParams);
      subscriptionRef.current = subscription;
      
      setIsConnected(true);
      setConnectionStatus('connected');
      retryCount.current = 0;

      // SDK doesn't expose a native "onClose" easily in this version, 
      // but if we were using raw WS we'd listen there. 
      // The SDK handles some internal reconnection.

    } catch (error) {
      console.error('Reactivity connection failed:', error);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      
      retryCount.current += 1;
      setTimeout(connectReactivity, 3000);
    }
  }, []);

  useEffect(() => {
    connectReactivity();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [connectReactivity]);

  return {
    liveEvents,
    isConnected,
    connectionStatus,
    totalMints
  };
}
