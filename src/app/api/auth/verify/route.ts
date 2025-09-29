import { SiweMessage } from 'siwe';
import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  try {
    const { message, signature } = await req.json();
    const siweMessage = new SiweMessage(message);
    
    // Retrieve the nonce from our session
    const expectedNonce = session.nonce;

    if (!expectedNonce) {
       return NextResponse.json({ message: 'No nonce found in session. Please request one first.' }, { status: 422 });
    }

    const { data } = await siweMessage.verify({
      signature,
      nonce: expectedNonce,
    });
    
    // Consume the nonce after successful verification
    session.nonce = undefined;
    session.siwe = data;
    await session.save();

    return NextResponse.json({ ok: true, address: data.address });
  } catch (error: any) {
    console.error("Verification Error:", error);
    // Clear the nonce on failure to prevent replay attacks with a failed nonce
    session.nonce = undefined;
    await session.save();
    
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
