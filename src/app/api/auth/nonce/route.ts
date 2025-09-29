import { NextRequest, NextResponse } from 'next/server';
import { generateNonce } from 'siwe';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  try {
    const nonce = generateNonce();
    if (!nonce) {
      console.error('Nonce generation failed: generateNonce() returned a falsy value.');
      return NextResponse.json({ message: 'Failed to generate nonce.' }, { status: 500 });
    }
    
    session.nonce = nonce;
    await session.save();

    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Failed to generate nonce:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}