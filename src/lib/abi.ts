import { keccak256, toHex } from 'viem';

export const FORTUNE_MINTED_SIGNATURE = 'FortuneMinted(uint256,address,string,uint8,uint256)';
export const FORTUNE_MINTED_TOPIC = keccak256(toHex(FORTUNE_MINTED_SIGNATURE));

export const FORTUNE_ABI = [
  {
    name: 'mintFortune',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'fortuneText', type: 'string' },
      { name: 'txCount', type: 'uint256' },
      { name: 'totalValue', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'mintPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'tokenOfOwnerByIndex',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'fortunes',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'walletAddress', type: 'address' },
      { name: 'fortuneText', type: 'string' },
      { name: 'txCount', type: 'uint256' },
      { name: 'totalValue', type: 'uint256' },
      { name: 'timestamp', type: 'uint256' },
      { name: 'rarity', type: 'uint8' },
    ],
  },
  {
    name: 'FortuneMinted',
    type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'fortuneText', type: 'string', indexed: false },
      { name: 'rarity', type: 'uint8', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

export const HANDLER_ABI = [
  {
    name: 'reactionCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'walletReactions',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'FortuneReaction',
    type: 'event',
    inputs: [
      { name: 'wallet', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: false },
      { name: 'rarity', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;
