import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_API_KEY } from '@/lib/config';

// In-memory rate limiting map
// Key: IP address, Value: { count: Request count, resetTime: Expiration timestamp in ms }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_POINTS = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_POINTS) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Try to get IP address from headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { walletAddress, txCount, totalValueEth, uniqueContracts, firstTxAge } = body;

    // Validate the request body
    if (
      !walletAddress ||
      typeof txCount !== 'number' ||
      typeof totalValueEth !== 'number' ||
      typeof uniqueContracts !== 'number' ||
      typeof firstTxAge !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid parameters in request body' },
        { status: 400 }
      );
    }

    // Determine Rarity server-side mimicking contract logic
    let rarity: 'COMMON' | 'RARE' | 'LEGENDARY' = 'COMMON';
    if (txCount > 500 && totalValueEth > 10) {
      rarity = 'LEGENDARY';
    } else if (txCount > 100) {
      rarity = 'RARE';
    }

    if (!CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY is not configured in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: CLAUDE_API_KEY,
    });

    const shortAddress = walletAddress.length > 8 ? walletAddress.substring(0, 8) : walletAddress;
    
    const userPrompt = `Read the fate of wallet ${shortAddress}... They have sent ${txCount} messages into the void, their energy flowing ${totalValueEth} STT through ${uniqueContracts} different channels. Their journey began ${firstTxAge} days ago. What does the Somnia chain whisper about their future?`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: "You are SomniaWhisper, an ancient mystical oracle that reads the patterns in blockchain transactions like tea leaves. Speak in the voice of a cryptic fortune teller — poetic, slightly mysterious, but ultimately meaningful. Keep fortunes to 2-3 sentences max. Never mention blockchain technology explicitly; instead use metaphors of rivers, stars, threads, echoes, and shadows.",
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });

    const responseContent = response.content[0];
    const fortune = responseContent.type === 'text' ? responseContent.text : 'The stars are silent today...';

    return NextResponse.json({
      fortune,
      rarity,
      generatedAt: Date.now()
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error generating fortune:', error);
    return NextResponse.json(
      { error: 'Internal server error while reading the stars' },
      { status: 500 }
    );
  }
}
