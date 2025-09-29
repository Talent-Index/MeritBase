import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { generateNonce } from 'siwe';

// This is a stateless route handler, so we can use dynamic functions.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.nonce = generateNonce();
    await session.save();
    
    return NextResponse.json({ nonce: session.nonce });
  } catch (error) {
    console.error('Failed to generate nonce:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
