import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { generateNonce } from 'siwe';

import { sessionOptions, SessionData } from '@/lib/session';

// This is a stateless route handler, so we can use dynamic functions.
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.nonce = generateNonce();
    await session.save();

    // Explicitly create a response and pass the session headers
    const response = NextResponse.json({ nonce: session.nonce });
    
    // iron-session attaches headers to the request object to be passed to the response.
    // We need to manually append them.
    req.headers.forEach((value, key) => {
        if (key.toLowerCase().includes('cookie')) {
            response.headers.append(key, value);
        }
    });

    return response;

  } catch (error) {
    console.error('Failed to generate nonce:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
