export const NEXT_PUBLIC_SOMNIA_RPC = process.env.NEXT_PUBLIC_SOMNIA_RPC || 'https://dream-rpc.somnia.network';
export const NEXT_PUBLIC_SOMNIA_WS = process.env.NEXT_PUBLIC_SOMNIA_WS || 'wss://dream-rpc.somnia.network';
export const NEXT_PUBLIC_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || '50312');
export const NEXT_PUBLIC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` | undefined;
export const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (process.env.NODE_ENV === 'production') {
  if (!NEXT_PUBLIC_CONTRACT_ADDRESS) {
    throw new Error('NEXT_PUBLIC_CONTRACT_ADDRESS is missing. It is required in production.');
  }
}
