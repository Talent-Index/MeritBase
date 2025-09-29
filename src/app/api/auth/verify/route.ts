import { SiweMessage } from 'siwe';
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';
import { getNonce, consumeNonce } from '@/lib/nonce-store';

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  try {
    const { message, signature } = await req.json();
    const siweMessage = new SiweMessage(message);
    
    // Retrieve the nonce from our in-memory store
    const expectedNonce = getNonce(siweMessage.address);

    if (!expectedNonce) {
       return NextResponse.json({ message: 'No nonce found for this address. Please try again.' }, { status: 422 });
    }

    const { data } = await siweMessage.verify({
      signature,
      nonce: expectedNonce,
    });
    
    // Consume the nonce after successful verification
    consumeNonce(data.address);

    session.siwe = data;
    await session.save();

    return NextResponse.json({ ok: true, address: data.address });
  } catch (error: any) {
    console.error("Verification Error:", error);
    if (error instanceof Error) {
       return NextResponse.json(
        { ok: false, message: `Verification failed: ${error.message}` },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { ok: false, message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
